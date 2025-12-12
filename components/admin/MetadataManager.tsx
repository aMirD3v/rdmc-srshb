
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';

interface Metadata {
  id: string;
  key: string;
  value: string;
}

// Maps machine-readable keys to human-readable labels
const METADATA_LABELS: { [key: string]: string } = {
    'dc.title': 'Title',
    'dc.contributor.author': 'Author(s)',
    'dc.title.alternative': 'Alternative Title(s)',
    'dc.date.issued': 'Date Issued',
    'dc.publisher': 'Publisher',
    'dc.identifier.citation': 'Citation',
    'dc.relation.ispartofseries': 'Series',
    'dc.identifier.uri': 'Identifier (URI)',
    'dc.type': 'Type',
    'dc.language.iso': 'Language (ISO)',
    'dc.subject': 'Subject Keywords',
    'dc.description.abstract': 'Abstract',
    'dc.description.sponsorship': 'Sponsors',
    'dc.description': 'Description',
};

// Defines the order of fields in the form
const METADATA_FIELD_ORDER = [
    'dc.title', 'dc.contributor.author', 'dc.date.issued', 'dc.publisher',
    'dc.subject', 'dc.type', 'dc.language.iso', 'dc.identifier.citation',
    'dc.relation.ispartofseries', 'dc.identifier.uri', 'dc.title.alternative',
    'dc.description', 'dc.description.abstract', 'dc.description.sponsorship'
];

// Adds input attributes like placeholder and type
const METADATA_ATTRIBUTES: { [key: string]: { placeholder: string; type: string; } } = {
    'dc.title': { placeholder: 'The main title of the item', type: 'text' },
    'dc.contributor.author': { placeholder: 'e.g., Smith, John; Doe, Jane', type: 'text' },
    'dc.title.alternative': { placeholder: 'e.g., An Alternate Title', type: 'text' },
    'dc.date.issued': { placeholder: 'YYYY-MM-DD', type: 'date' },
    'dc.publisher': { placeholder: 'e.g., University of Knowledge', type: 'text' },
    'dc.identifier.citation': { placeholder: 'e.g., Journal of Important Results, 2(1), 2025.', type: 'text' },
    'dc.relation.ispartofseries': { placeholder: 'e.g., Technical Reports Series', type: 'text' },
    'dc.identifier.uri': { placeholder: 'e.g., https://doi.org/10.123/456', type: 'url' },
    'dc.type': { placeholder: 'e.g., Article, Book, Dataset', type: 'text' },
    'dc.language.iso': { placeholder: 'e.g., en_US, es, fr', type: 'text' },
    'dc.subject': { placeholder: 'Keywords separated by semicolons', type: 'textarea' },
    'dc.description.abstract': { placeholder: 'A short summary of the item...', type: 'textarea' },
    'dc.description.sponsorship': { placeholder: 'e.g., National Science Foundation', type: 'text' },
    'dc.description': { placeholder: 'A general description of the item', type: 'textarea' },
};

export default function MetadataManager() {
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const { id: itemId } = useParams();

  useEffect(() => {
    if (itemId) {
      const fetchMetadata = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/admin/items/${itemId}/metadata`);
          if (response.ok) {
            const data = await response.json();
            const sortedData = METADATA_FIELD_ORDER.map(key =>
              data.find((m: Metadata) => m.key === key)
            ).filter(Boolean);
            setMetadata(sortedData);
          } else {
             setFormError('Failed to fetch metadata.');
          }
        } catch (err) {
            setFormError('An error occurred while fetching metadata.');
        } finally {
            setLoading(false);
        }
      };
      fetchMetadata();
    }
  }, [itemId]);

  const handleInputChange = (metadataId: string, value: string) => {
    setMetadata(prev =>
      prev.map(m => (m.id === metadataId ? { ...m, value } : m))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    
    try {
        const response = await fetch(`/api/admin/items/${itemId}/metadata`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metadata),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Failed to save metadata.');
        }
        
    } catch (err: any) {
        setFormError(err.message);
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <p>Loading metadata...</p>;
  if (formError && metadata.length === 0) return <p className="text-red-500">Error: {formError}</p>;

  return (
    <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Edit Metadata</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {metadata.map((m) => {
                    const attrs = METADATA_ATTRIBUTES[m.key] || { placeholder: '', type: 'text' };
                    const label = METADATA_LABELS[m.key] || m.key;
                    
                    const fieldProps = {
                        id: m.id,
                        value: m.value,
                        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(m.id, e.target.value),
                        placeholder: attrs.placeholder,
                        className: "mt-1",
                    };

                    const renderField = () => {
                        if (attrs.type === 'textarea') {
                            return <Textarea {...fieldProps} rows={3} />;
                        }
                        return <Input {...fieldProps} type={attrs.type} />;
                    };
                    
                    const fieldContainerClass = m.key === 'dc.title' ? "md:col-span-2" : "";

                    return (
                        <div key={m.id} className={fieldContainerClass}>
                            <Label htmlFor={m.id}>{label}</Label>
                            {renderField()}
                        </div>
                    );
                })}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 items-center">
                {formError && <p className="text-sm text-red-500 mr-auto">Error: {formError}</p>}
                <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
    </form>
  );
}

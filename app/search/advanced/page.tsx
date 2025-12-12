'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { PlusCircle, MinusCircle, Search as SearchIcon } from 'lucide-react';

type QueryRow = {
    field: 'any' | 'title' | 'author' | 'subject' | 'abstract';
    operator: 'contains' | 'equals' | 'startsWith';
    value: string;
};

type BooleanOperator = 'AND' | 'OR' | 'NOT';

type QueryElement = QueryRow | BooleanOperator;

const fieldOptions = [
    { value: 'any', label: 'Any Field' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'subject', label: 'Subject' },
    { value: 'abstract', label: 'Abstract' },
];

const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
];

export default function AdvancedSearchPage() {
    const [queryElements, setQueryElements] = useState<QueryElement[]>(() => [
        { field: 'any', operator: 'contains', value: '' } as QueryRow
    ]);
    const router = useRouter();

    const handleAddRow = (index: number) => {
        const newElements: QueryElement[] = [...queryElements];
        // Insert an AND operator and a new query row
        newElements.splice(index + 1, 0, 'AND', { field: 'any', operator: 'contains', value: '' });
        setQueryElements(newElements);
    };

    const handleRemoveRow = (index: number) => {
        const newElements: QueryElement[] = [...queryElements];
        // If removing a query row, also remove the preceding boolean operator if it exists
        if (index > 0 && typeof newElements[index - 1] !== 'object') {
            newElements.splice(index - 1, 2);
        } else {
            newElements.splice(index, 1);
        }
        setQueryElements(newElements);
    };
    
    const handleUpdateRow = (index: number, newRow: QueryRow) => {
        const newElements = [...queryElements];
        newElements[index] = newRow;
        setQueryElements(newElements);
    }
    
    const handleUpdateBoolean = (index: number, newOp: BooleanOperator) => {
        const newElements = [...queryElements];
        newElements[index] = newOp;
        setQueryElements(newElements);
    }

    const handleSearch = () => {
        try {
            // Filter out any empty query rows before searching
            const cleanedQuery = queryElements.filter(el => {
                if (typeof el === 'string') return true; // Keep boolean operators
                return el.value.trim() !== '';
            });

            if (cleanedQuery.length === 0) return;

            const queryString = encodeURIComponent(JSON.stringify(cleanedQuery));
            router.push(`/search?advancedQuery=${queryString}`);
        } catch (error) {
            console.error("Failed to build or navigate search query:", error);
            // Optionally, show an error to the user
        }
    };

    return (
        <div className="container mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Advanced Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {queryElements.map((element, index) => {
                        if (typeof element === 'string') {
                            // Render Boolean Operator
                            return (
                                <div key={index} className="flex items-center justify-center">
                                    <select
                                        value={element}
                                        onChange={(e) => handleUpdateBoolean(index, e.target.value as BooleanOperator)}
                                        className="border border-gray-300 rounded-md px-3 py-1.5 font-semibold"
                                    >
                                        <option>AND</option>
                                        <option>OR</option>
                                        <option>NOT</option>
                                    </select>
                                </div>
                            );
                        }
                        
                        // Render Query Row
                        const row = element as QueryRow;
                        return (
                            <div key={index} className="flex flex-col sm:flex-row gap-2 items-center">
                                <select 
                                    value={row.field} 
                                    onChange={(e) => handleUpdateRow(index, {...row, field: e.target.value as QueryRow['field']})}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
                                >
                                    {fieldOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <select 
                                    value={row.operator} 
                                    onChange={(e) => handleUpdateRow(index, {...row, operator: e.target.value as QueryRow['operator']})}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto"
                                >
                                    {operatorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <Input 
                                    type="text"
                                    value={row.value}
                                    onChange={(e) => handleUpdateRow(index, {...row, value: e.target.value})}
                                    placeholder="Enter search term..."
                                    className="flex-grow"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => handleAddRow(index)}>
                                        <PlusCircle className="w-6 h-6 text-green-600" />
                                    </button>
                                    {/* Only show remove button if there's more than one query row */}
                                    {queryElements.filter(e => typeof e !== 'string').length > 1 && (
                                        <button onClick={() => handleRemoveRow(index)}>
                                            <MinusCircle className="w-6 h-6 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSearch} className="ml-auto">
                        <SearchIcon className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, ChevronsRight, Folder, Users } from "lucide-react";

// Maps machine-readable keys to human-readable labels
const METADATA_LABELS: { [key: string]: string } = {
    'dc.contributor.author': 'Author(s)',
    'dc.date.issued': 'Date Issued',
    'dc.publisher': 'Publisher',
    'dc.identifier.citation': 'Citation',
    'dc.relation.ispartofseries': 'Series',
    'dc.identifier.uri': 'Identifier (URI)',
    'dc.type': 'Type',
    'dc.language.iso': 'Language (ISO)',
    'dc.subject': 'Subject(s)',
    'dc.description.sponsorship': 'Sponsor(s)',
};

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default async function ItemPage({ params }: { params: { itemId: string } }) {
  const item = await prisma.item.findUnique({
    where: { 
        id: params.itemId,
        status: 'PUBLISHED' 
    },
    include: { 
        metadata: true, 
        bitstreams: true,
        collection: {
            include: {
                community: true,
            }
        }
    },
  });

  if (!item) {
    notFound();
  }

  const metadataMap = new Map(item.metadata.map(m => [m.key, m.value]));
  const abstract = metadataMap.get('dc.description.abstract') || '';
  const authors = metadataMap.get('dc.contributor.author') || 'N/A';
  const dateIssued = metadataMap.get('dc.date.issued') || 'N/A';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                        <span><strong>Authors:</strong> {authors}</span>
                        <span className="hidden md:inline">|</span>
                        <span><strong>Issued:</strong> {dateIssued}</span>
                    </div>
                </div>

                {/* Abstract */}
                {abstract && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Abstract</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{abstract}</p>
                        </CardContent>
                    </Card>
                )}

                {/* All Metadata Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {Object.entries(METADATA_LABELS).map(([key, label]) => {
                                const value = metadataMap.get(key);
                                if (!value) return null;
                                return (
                                    <div key={key} className="border-t border-gray-200 pt-2">
                                        <dt className="font-semibold text-gray-800">{label}</dt>
                                        <dd className="text-gray-600">{value}</dd>
                                    </div>
                                )
                            })}
                        </dl>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                {/* Files */}
                <Card>
                    <CardHeader>
                        <CardTitle>Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {item.bitstreams.map(b => (
                                <li key={b.id} className="flex items-center justify-between gap-4 p-2 rounded-md bg-gray-50 hover:bg-gray-100">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{b.name}</p>
                                            <p className="text-xs text-gray-500">{formatBytes(b.size)}</p>
                                        </div>
                                    </div>
                                    <a href={`/api/download/${b.id}`} download>
                                        <Button className="flex-shrink-0">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </a>
                                </li>
                            ))}
                        </ul>
                         {item.bitstreams.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No files available for this item.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Collection Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Part of</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Community</p>
                                <Link href={`/communities/${item.collection.community.id}`} className="font-semibold text-blue-600 hover:underline">
                                    {item.collection.community.name}
                                </Link>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Folder className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Collection</p>
                                <Link href={`/collections/${item.collection.id}`} className="font-semibold text-blue-600 hover:underline">
                                    {item.collection.name}
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
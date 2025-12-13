import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from '@prisma/client';
import { buildAdvancedWhereClause, QueryElement } from "@/lib/search-builder";
import DiscoverSidebar from "@/components/DiscoverSidebar";

const PAGE_SIZE = 10;

// Maps the public facet name from the URL to the internal metadata key
const FACET_KEY_MAP: { [key: string]: string } = {
    'subject': 'dc.subject',
    'author': 'dc.contributor.author',
};

export default async function SearchPage({ searchParams }: { searchParams: { query?: string, facet?: string, page?: string, startDate?: string, endDate?: string, advancedQuery?: string } }) {
  let query: string | undefined;
  let facet: string | undefined;
  let page: string | undefined;
  let startDate: string | undefined;
  let endDate: string | undefined;
  let advancedQuery: string | undefined;

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'query') query = value as string;
    else if (key === 'facet') facet = value as string;
    else if (key === 'page') page = value as string;
    else if (key === 'startDate') startDate = value as string;
    else if (key === 'endDate') endDate = value as string;
    else if (key === 'advancedQuery') advancedQuery = value as string;
  }

  // Assign default value for page after collecting all properties
  const currentPage = parseInt(page ?? '1', 10);

  let items = [];
  let totalItems = 0;
  let where: Prisma.ItemWhereInput = { status: 'PUBLISHED' };
  let description = 'Browsing all published items.';
  let searchUrlParams = '';

  if (advancedQuery) {
    try {
        const queryElements: QueryElement[] = JSON.parse(decodeURIComponent(advancedQuery));
        const advancedWhere = buildAdvancedWhereClause(queryElements);
        where.AND = [...(where.AND as any[] || []), ... (advancedWhere.AND || [])];
        description = 'Advanced search results';
        searchUrlParams = `advancedQuery=${advancedQuery}`;
    } catch(e) {
        console.error("Failed to parse advanced query", e);
        description = "Error: Invalid advanced search query.";
    }
  } else if (facet === 'date' && startDate && endDate) {
    where.metadata = {
        some: {
            key: 'dc.date.issued',
            value: {
                gte: `${startDate}-01-01`,
                lte: `${endDate}-12-31`,
            }
        }
    };
    description = `Found items between ${startDate} and ${endDate}`;
    searchUrlParams = `facet=date&startDate=${startDate}&endDate=${endDate}`;

  } else if (query && facet && FACET_KEY_MAP[facet]) {
    const metadataKey = FACET_KEY_MAP[facet];
    where.metadata = { some: { key: metadataKey, value: { contains: query, mode: 'insensitive' } }};
    description = `Found items with ${facet} "${query}"`;
    searchUrlParams = `query=${encodeURIComponent(query)}&facet=${encodeURIComponent(facet)}`;

  } else if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' }},
      { metadata: { some: { value: { contains: query, mode: 'insensitive' }}}}, 
    ];
    description = `Found results for "${query}"`;
    searchUrlParams = `query=${encodeURIComponent(query)}`;
  }

  // Only run the query if there are search terms
  const performSearch = advancedQuery || query || startDate || facet;

  if (performSearch) {
    totalItems = await prisma.item.count({ where });
    items = await prisma.item.findMany({
      where,
      include: {
        collection: true,
        metadata: {
            where: { key: 'dc.description.abstract' },
            take: 1
        }
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: 'desc' }
    });
  } else {
    // Default view: show latest items if no search is performed
    totalItems = await prisma.item.count({where: { status: 'PUBLISHED' }});
    items = await prisma.item.findMany({
        where: { status: 'PUBLISHED' },
        include: {
            collection: true,
            metadata: { where: { key: 'dc.description.abstract' }, take: 1 }
        },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: 'desc' }
    });
  }


  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginationBaseUrl = `/search?${searchUrlParams}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
                <DiscoverSidebar />
            </div>
            {/* Main Content */}
            <div className="lg:col-span-3">
                <h1 className="text-3xl font-bold mb-4">Search Results</h1>
                <p className="mb-8 text-gray-600">{description} ({totalItems} total)</p>

                <div className="divide-y divide-gray-200">
                    {items.length > 0 ? items.map((item) => {
                    const abstract = item.metadata[0]?.value || '';
                    return (
                        <div key={item.id} className="py-6">
                            <Link href={`/items/${item.id}`}>
                            <h3 className="text-xl text-blue-600 hover:underline cursor-pointer font-semibold">{item.title}</h3>
                            </Link>
                            <p className="text-gray-500 text-sm mt-1">In collection: {item.collection.name}</p>
                            {abstract && <p className="text-gray-700 mt-2 line-clamp-2">{abstract}</p>}
                        </div>
                    );
                    }) : (
                    <p className="text-center py-10 text-gray-500">No results found for your criteria.</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={paginationBaseUrl} />
                    </div>
                )}
            </div>

          
        </div>
    </div>
  );
}

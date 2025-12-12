import { Prisma } from '@prisma/client';

type QueryRow = {
    field: 'any' | 'title' | 'author' | 'subject' | 'abstract';
    operator: 'contains' | 'equals' | 'startsWith';
    value: string;
};

type BooleanOperator = 'AND' | 'OR' | 'NOT';

export type QueryElement = QueryRow | BooleanOperator;

const METADATA_KEY_MAP: { [key: string]: string } = {
    'author': 'dc.contributor.author',
    'subject': 'dc.subject',
    'abstract': 'dc.description.abstract',
};

function buildSingleQuery(row: QueryRow): Prisma.ItemWhereInput {
    const { field, operator, value } = row;

    if (field === 'any') {
        return {
            OR: [
                { title: { [operator]: value, mode: 'insensitive' } },
                { metadata: { some: { value: { [operator]: value, mode: 'insensitive' } } } }
            ]
        };
    }
    
    if (field === 'title') {
        return { title: { [operator]: value, mode: 'insensitive' } };
    }

    const metadataKey = METADATA_KEY_MAP[field];
    if (metadataKey) {
        return {
            metadata: {
                some: {
                    key: metadataKey,
                    value: { [operator]: value, mode: 'insensitive' }
                }
            }
        };
    }

    return {};
}

export function buildAdvancedWhereClause(elements: QueryElement[]): Prisma.ItemWhereInput {
    if (!elements || elements.length === 0) {
        return {};
    }

    const prismaQuery: { AND: Prisma.ItemWhereInput[] } = { AND: [] };
    let currentBoolean: BooleanOperator = 'AND';
    let negation = false;

    for (const element of elements) {
        if (typeof element === 'string') {
            // It's a boolean operator for the *next* element
            if (element === 'NOT') {
                negation = true;
            } else {
                currentBoolean = element;
            }
            continue;
        }

        let singleWhere = buildSingleQuery(element as QueryRow);

        if (negation) {
            singleWhere = { NOT: singleWhere };
            negation = false; 
        }

        if (currentBoolean === 'OR') {
            // If the last element in AND was an OR, merge with it
            const lastInAnd = prismaQuery.AND[prismaQuery.AND.length - 1];
            if (lastInAnd && lastInAnd.OR) {
                lastInAnd.OR.push(singleWhere);
            } else {
                 // Start a new OR group
                const previousQuery = prismaQuery.AND.pop() || {};
                prismaQuery.AND.push({ OR: [previousQuery, singleWhere] });
            }
        } else { // 'AND'
            prismaQuery.AND.push(singleWhere);
        }
        
        // Reset to default for next element
        currentBoolean = 'AND';
    }

    return prismaQuery;
}

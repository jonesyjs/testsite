import { createClient } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!;
const previewToken = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN!;

// Regular client for published content
export const client = createClient({
  space,
  accessToken,
});

// Preview client for draft content
export const previewClient = createClient({
  space,
  accessToken: previewToken,
  host: 'preview.contentful.com',
});

// Helper to get the right client based on preview mode
export const getContentfulClient = (preview = false) => {
  return preview ? previewClient : client;
};

export const getConceptScheme = async (schemeId: string, preview = false) => {
  const contentfulClient = getContentfulClient(preview);
  return contentfulClient.getConceptScheme(schemeId);
}

export const getConcepts = async (preview = false) => {
  const contentfulClient = getContentfulClient(preview);
  return contentfulClient.getConcepts();
}

export const getSvgAssets = async (preview = false) => {
  const contentfulClient = getContentfulClient(preview);
  const entries = await contentfulClient.getEntries({
    content_type: 'svgAsset',
  });
  return entries.items;
}

export const getSvgAsset = async (assetId: string, preview = false) => {
  const contentfulClient = getContentfulClient(preview);
  const entry = await contentfulClient.getEntry(assetId);
  return entry;
}

export const buildTaxonomyTree = async (schemeId: string, preview = false) => {
  const [schemeRes, conceptsRes] = await Promise.all([
    getConceptScheme(schemeId, preview),
    getConcepts(preview),
  ]);

  const tree = {
    id: schemeRes.sys.id,
    name: 'Taxonomy',
    type: 'conceptScheme',
    children: [...conceptsRes.items]
  };

  console.log(tree);

  return tree;
}

export { createClient };


// interface ConceptSchemeNode {
//     id: string;                     // e.g. "travel"
//     name: string;                   // e.g. "Taxonomy"
//     type: "conceptScheme";
//     children: ConceptNode[];        // Nested list of child concepts
//   }
  
//   interface ConceptNode {
//     id: string;                     // Concept ID, e.g. "destinations"
//     type: "TaxonomyConcept";
//     createdAt: string;             
//     updatedAt: string;             
//     version: number;               
//     uri: string | null;            
//     notations: any[];              
//     conceptSchemes: { sys: { id: string } }[]; // Which scheme(s) this belongs to
//     broaderIds: string[];          // Parent concept IDs
//     relatedIds: string[];          // Cross-linked concept IDs
//     prefLabel: Record<string, string>;
//     altLabels: Record<string, string[]>;
//     hiddenLabels: Record<string, string[]>;
//     note: Record<string, string>;
//     definition: Record<string, string>;
//     // Additional metadata fields omitted for brevity
//   }
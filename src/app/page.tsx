import { buildTaxonomyTree } from '@/lib/contentful';
import SvgFromContentful, { SvgAssetsList } from '@/components/SvgFromContentful';
import PreviewToggle from '@/components/PreviewToggle';
import { draftMode } from 'next/headers';

export default async function Home() {
  const { isEnabled: isPreview } = await draftMode();
  
  let taxonomyTree;
  let contentfulError = false;
  
  try {
    taxonomyTree = await buildTaxonomyTree("travel", isPreview);
  } catch (error) {
    console.error('Failed to fetch taxonomy tree:', error);
    contentfulError = true;
    taxonomyTree = {
      id: 'fallback',
      name: 'Taxonomy (Configuration Required)',
      type: 'conceptScheme',
      children: []
    };
  }
  
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <PreviewToggle isPreview={isPreview} />
      </div>
      
      {contentfulError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">⚠️ Contentful Configuration Required</h3>
          <p>Please set up your Contentful environment variables to enable content loading.</p>
          <ul className="mt-2 text-sm list-disc list-inside">
            <li>NEXT_PUBLIC_CONTENTFUL_SPACE_ID</li>
            <li>NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN</li>
            <li>NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN</li>
            <li>CONTENTFUL_PREVIEW_SECRET</li>
          </ul>
        </div>
      )}
      
      {isPreview && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <span className="font-medium">🔴 LIVE PREVIEW MODE - Content updates every 2 seconds</span>
        </div>
      )}
      
      <section>
        <h2 className="text-2xl font-bold mb-6">SVG from Contentful</h2>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Your SVG Asset:</h3>
          {contentfulError ? (
            <div className="text-gray-500 italic">Configure Contentful to load SVG assets</div>
          ) : (
            <SvgFromContentful className="w-full max-w-md" preview={isPreview} />
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          {contentfulError ? (
            <div className="text-gray-500 italic">Configure Contentful to load SVG assets list</div>
          ) : (
            <SvgAssetsList preview={isPreview} />
          )}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Taxonomy Tree</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(taxonomyTree, null, 2)}
        </pre>
      </section>
    </div>
  );
}

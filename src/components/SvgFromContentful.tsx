'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSvgAssets, getSvgAsset } from '@/lib/contentful';
import { Entry, EntrySkeletonType } from 'contentful';

interface SvgAssetProps {
  assetId?: string;
  className?: string;
  preview?: boolean;
}

interface SvgAssetFields {
  title: string;
  svgCode: string;
}

interface SvgAssetSkeleton extends EntrySkeletonType {
  contentTypeId: 'svgAsset';
  fields: SvgAssetFields;
}

export default function SvgFromContentful({ assetId, className, preview = false }: SvgAssetProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSvg = useCallback(async () => {
    try {
      setLoading(true);
      
      if (assetId) {
        // Fetch specific asset
        const asset = await getSvgAsset(assetId, preview) as Entry<SvgAssetSkeleton>;
        setSvgContent(asset.fields.svgCode);
      } else {
        // Fetch first available SVG asset
        const assets = await getSvgAssets(preview) as Entry<SvgAssetSkeleton>[];
        if (assets.length > 0) {
          setSvgContent(assets[0].fields.svgCode);
        } else {
          setError('No SVG assets found');
        }
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch SVG: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [assetId, preview]);

  useEffect(() => {
    fetchSvg();
  }, [fetchSvg]);

  // Auto-refresh in preview mode
  useEffect(() => {
    if (!preview) return;
    
    const interval = setInterval(() => {
      fetchSvg();
    }, 2000); // Refresh every 2 seconds in preview mode

    return () => clearInterval(interval);
  }, [fetchSvg, preview]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded w-16 h-16"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="text-xs text-green-600 font-medium">
          🟢 LIVE PREVIEW - Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}

// Component to list all available SVG assets
export function SvgAssetsList({ preview = false }: { preview?: boolean }) {
  const [assets, setAssets] = useState<Entry<SvgAssetSkeleton>[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAssets = useCallback(async () => {
    try {
      const svgAssets = await getSvgAssets(preview) as Entry<SvgAssetSkeleton>[];
      setAssets(svgAssets);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch SVG assets:', err);
    } finally {
      setLoading(false);
    }
  }, [preview]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Auto-refresh in preview mode
  useEffect(() => {
    if (!preview) return;
    
    const interval = setInterval(() => {
      fetchAssets();
    }, 2000); // Refresh every 2 seconds in preview mode

    return () => clearInterval(interval);
  }, [fetchAssets, preview]);

  if (loading) {
    return <div>Loading SVG assets...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available SVG Assets</h2>
        {preview && (
          <div className="text-xs text-green-600 font-medium">
            🟢 LIVE PREVIEW - Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
      {assets.map((asset) => (
        <div key={asset.sys.id} className="border p-4 rounded">
          <h3 className="font-medium mb-2">{asset.fields.title}</h3>
          <div className="bg-gray-50 p-2 rounded">
            <SvgFromContentful assetId={asset.sys.id} preview={preview} />
          </div>
        </div>
      ))}
    </div>
  );
} 
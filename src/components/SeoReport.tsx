import React from 'react';

interface Metadata {
  pageTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  h1Tags: string[];
  imageCount: number;
  hasFavicon: boolean;
  titleLength?: number;
  descriptionLength?: number;
}

interface SeoReportProps {
  report: {
    id?: number;
    url: string;
    metadata: Metadata;
    aiFeedback: string;
    createdAt?: string;
  };
  onExport?: () => void;
}

export default function SeoReport({ report, onExport }: SeoReportProps) {
  const { metadata, aiFeedback, url, createdAt } = report;

  const getStatusColor = (hasValue: boolean) => {
    return hasValue ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (hasValue: boolean) => {
    return hasValue ? '✓' : '✗';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Analysis Report</h2>
            
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {url}
            </a>
            {createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Generated: {new Date(createdAt).toLocaleString()}
              </p>
            )}
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              Export Report
            </button>
          )}
        </div>
      </div>

      {/* Metadata Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Page Metadata</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${getStatusColor(!!metadata.pageTitle)}`}>
                {getStatusIcon(!!metadata.pageTitle)}
              </span>
              <span className="font-medium text-gray-700">Page Title</span>
              {metadata.titleLength && (
                <span className="text-sm text-gray-500">
                  ({metadata.titleLength} characters)
                </span>
              )}
            </div>
            <p className="text-gray-600 ml-6">
              {metadata.pageTitle || 'No title found'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${getStatusColor(!!metadata.metaDescription)}`}>
                {getStatusIcon(!!metadata.metaDescription)}
              </span>
              <span className="font-medium text-gray-700">Meta Description</span>
              {metadata.descriptionLength && (
                <span className="text-sm text-gray-500">
                  ({metadata.descriptionLength} characters)
                </span>
              )}
            </div>
            <p className="text-gray-600 ml-6">
              {metadata.metaDescription || 'No description found'}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${getStatusColor(metadata.h1Tags.length > 0)}`}>
                {getStatusIcon(metadata.h1Tags.length > 0)}
              </span>
              <span className="font-medium text-gray-700">H1 Tags</span>
              <span className="text-sm text-gray-500">
                ({metadata.h1Tags.length} found)
              </span>
            </div>
            {metadata.h1Tags.length > 0 ? (
              <ul className="ml-6 space-y-1">
                {metadata.h1Tags.map((tag, index) => (
                  <li key={index} className="text-gray-600">
                    • {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 ml-6">No H1 tags found</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <span className="font-medium text-gray-700">Images: </span>
              <span className="text-gray-600">{metadata.imageCount}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Favicon: </span>
              <span className={getStatusColor(metadata.hasFavicon)}>
                {metadata.hasFavicon ? 'Present' : 'Missing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered SEO Analysis</h3>
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {aiFeedback}
          </div>
        </div>
      </div>
    </div>
  );
}

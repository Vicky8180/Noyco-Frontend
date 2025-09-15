"use client";
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { 
  PhotoIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  CodeBracketIcon 
} from '@heroicons/react/24/outline';

const MermaidDiagram = ({ chart, id = 'mermaid-diagram', showToolbar = true, title }) => {
  const mermaidRef = useRef(null);
  const [showSource, setShowSource] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    // Initialize Mermaid with configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#f59e0b', // Yellow-500
        primaryTextColor: '#1f2937', // Gray-800
        primaryBorderColor: '#d97706', // Yellow-600
        lineColor: '#6b7280', // Gray-500
        secondaryColor: '#fef3c7', // Yellow-100
        tertiaryColor: '#fffbeb', // Yellow-50
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f9fafb', // Gray-50
        tertiaryBkg: '#f3f4f6', // Gray-100
        edgeLabelBackground: '#ffffff',
        clusterBkg: '#fef3c7',
        altBackground: '#f9fafb',
        cScale0: '#f59e0b',
        cScale1: '#84cc16',
        cScale2: '#06b6d4',
        cScale3: '#8b5cf6',
        cScale4: '#ef4444',
      },
      flowchart: {
        nodeSpacing: 50,
        rankSpacing: 60,
        curve: 'basis',
        padding: 20,
        useMaxWidth: true,
        htmlLabels: true,
        diagramPadding: 8,
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true,
      },
      state: {
        padding: 10,
        useMaxWidth: true,
      },
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      fontSize: '14px',
    });

    const renderDiagram = async () => {
      if (mermaidRef.current && chart) {
        try {
          setIsRendering(true);
          // Clear any existing content
          mermaidRef.current.innerHTML = '';
          
          // Generate unique ID for this diagram
          const diagramId = `${id}-${Date.now()}`;
          
          // Render the diagram
          const { svg } = await mermaid.render(diagramId, chart);
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
          mermaidRef.current.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-700">Error rendering diagram: ${error.message}</p>
              <pre class="text-sm text-red-600 mt-2 overflow-x-auto whitespace-pre-wrap">${chart}</pre>
            </div>
          `;
        } finally {
          setIsRendering(false);
        }
      }
    };

    renderDiagram();
  }, [chart, id]);

  const exportAsPNG = async () => {
    if (!mermaidRef.current) return;
    
    const svg = mermaidRef.current.querySelector('svg');
    if (!svg) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.download = `${title || 'diagram'}.png`;
          a.href = url;
          a.click();
          URL.revokeObjectURL(url);
        });
        
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    } catch (error) {
      console.error('Error exporting diagram:', error);
    }
  };

  const exportAsSVG = () => {
    if (!mermaidRef.current) return;
    
    const svg = mermaidRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${title || 'diagram'}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySource = () => {
    navigator.clipboard.writeText(chart).then(() => {
      // Could add a toast notification here
      console.log('Mermaid source copied to clipboard');
    });
  };

  if (!chart) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No diagram data provided</p>
      </div>
    );
  }

  return (
    <div className="my-6">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
          <div className="flex items-center space-x-2">
            {title && <h3 className="font-medium text-gray-900">{title}</h3>}
            {isRendering && <span className="text-sm text-gray-500">Rendering...</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSource(!showSource)}
              className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title={showSource ? "Show Diagram" : "Show Source"}
            >
              {showSource ? (
                <>
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Diagram
                </>
              ) : (
                <>
                  <CodeBracketIcon className="h-4 w-4 mr-1" />
                  Source
                </>
              )}
            </button>
            
            <button
              onClick={copySource}
              className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Copy Source Code"
            >
              Copy Source
            </button>
            
            <button
              onClick={exportAsSVG}
              className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Export as SVG"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              SVG
            </button>
            
            <button
              onClick={exportAsPNG}
              className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
              title="Export as PNG"
            >
              <PhotoIcon className="h-4 w-4 mr-1" />
              PNG
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
        {showSource ? (
          <div className="p-6">
            <pre className="text-sm text-gray-800 font-mono bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {chart}
            </pre>
          </div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <div 
              ref={mermaidRef} 
              className="flex justify-center items-center min-h-[200px]"
              style={{ fontSize: '14px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MermaidDiagram;
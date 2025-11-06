import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JsonViewerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  title: string;
  highlight?: Set<string>;
  highlightMap?: Map<string, 'added' | 'removed' | 'modified'>;
  highlightTypes?: ('added' | 'removed' | 'modified')[];
  open?: boolean;
}

interface JsonNodeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  path: string;
  level: number;
  highlight?: Set<string>;
  highlightMap?: Map<string, 'added' | 'removed' | 'modified'>;
  highlightTypes?: ('added' | 'removed' | 'modified')[];
}

const JsonNode: React.FC<JsonNodeProps> = ({
  value,
  path,
  level,
  highlight,
  highlightMap,
  highlightTypes,
}) => {
  const [expanded, setExpanded] = useState(true);
  const isExpandable = value !== null && typeof value === 'object';
  const entries = isExpandable
    ? Array.isArray(value)
      ? value.map((v, i) => [i, v])
      : Object.entries(value)
    : [];

  // Check if this path should be highlighted
  const isHighlighted = highlight?.has(path);
  const changeType = highlightMap?.get(path);
  const shouldHighlight = highlightTypes && changeType && highlightTypes.includes(changeType);

  // Build highlight class
  let highlightClass = '';
  if (isHighlighted || shouldHighlight) {
    if (changeType === 'added') {
      highlightClass =
        'bg-green-500/10 dark:bg-green-900/30 border-l-[3px] border-green-600 dark:border-green-500 px-1 py-0.5 rounded-sm';
    } else if (changeType === 'removed') {
      highlightClass =
        'bg-red-500/10 dark:bg-red-900/30 border-l-[3px] border-red-600 dark:border-red-500 px-1 py-0.5 rounded-sm opacity-90';
    } else if (changeType === 'modified') {
      highlightClass =
        'bg-amber-500/10 dark:bg-amber-900/30 border-l-[3px] border-amber-600 dark:border-amber-500 px-1 py-0.5 rounded-sm';
    } else if (isHighlighted) {
      highlightClass =
        'bg-amber-500/10 dark:bg-amber-900/30 border-l-[3px] border-amber-600 dark:border-amber-500 px-1 py-0.5 rounded-sm';
    }
  }

  return (
    <div className={`flex items-start gap-1 mb-0.5 ${highlightClass}`}>
      {isExpandable ? (
        <>
          <Button
            className='flex items-center justify-center w-5 h-5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors'
            onClick={() => setExpanded(!expanded)}
            variant='ghost'
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          <span className='font-semibold text-foreground'>{Array.isArray(value) ? '[' : '{'}</span>
          {expanded && (
            <div className='flex flex-col' style={{ marginLeft: '20px' }}>
              {entries.map(([key, val], i) => (
                <div key={i} className='flex items-start gap-1'>
                  <span className='font-medium text-primary'>{JSON.stringify(key)}:</span>
                  <JsonNode
                    value={val}
                    path={`${path}.${key}`.replace(/^\.|^\./, '')}
                    level={level + 1}
                    highlight={highlight}
                    highlightMap={highlightMap}
                    highlightTypes={highlightTypes}
                  />
                </div>
              ))}
            </div>
          )}
          <span className='font-semibold text-foreground'>{Array.isArray(value) ? ']' : '}'}</span>
        </>
      ) : (
        <span className='text-foreground'>
          {value === null ? (
            <span className='text-muted-foreground italic'>null</span>
          ) : typeof value === 'string' ? (
            <span className='text-green-600 dark:text-green-400'>&quot;{value}&quot;</span>
          ) : typeof value === 'number' ? (
            <span className='text-red-600 dark:text-red-400'>{value}</span>
          ) : typeof value === 'boolean' ? (
            <span className='text-blue-600 dark:text-blue-400 font-medium'>{String(value)}</span>
          ) : (
            JSON.stringify(value)
          )}
        </span>
      )}
    </div>
  );
};

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  title,
  highlight,
  highlightMap,
  highlightTypes,
  open = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [showContent, setShowContent] = useState(open);

  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className='flex flex-col bg-background rounded border border-border overflow-hidden'>
      <div className='px-4 py-3 bg-muted border-b border-border font-semibold text-foreground text-sm flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setShowContent(!showContent)}
            className='flex items-center justify-center w-5 h-5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors'
            title={showContent ? 'Ocultar contenido' : 'Mostrar contenido'}
            variant='ghost'
          >
            {showContent ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
          <h3 className='m-0 text-sm'>{title}</h3>
        </div>
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            className='h-7 px-2.5 gap-1.5 text-xs'
            onClick={() => setShowRaw(true)}
          >
            <Code size={14} />
            Raw
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='h-7 px-2.5 gap-1.5 text-xs'
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={14} className='text-green-600' />
                Copiado
              </>
            ) : (
              <>
                <Copy size={14} />
                Copiar
              </>
            )}
          </Button>
        </div>
      </div>
      {showContent && (
        <div className='flex-1 overflow-auto p-4 font-mono text-xs text-foreground leading-relaxed'>
          <JsonNode
            value={data}
            path=''
            level={0}
            highlight={highlight}
            highlightMap={highlightMap}
            highlightTypes={highlightTypes}
          />
        </div>
      )}

      {/* Raw JSON Modal */}
      {showRaw && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-background border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-96 flex flex-col'>
            <div className='px-6 py-4 border-b border-border flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-foreground'>JSON Raw</h2>
              <Button
                onClick={() => setShowRaw(false)}
                className='text-muted-foreground hover:text-foreground transition-colors'
                variant='ghost'
              >
                ✕
              </Button>
            </div>
            <div className='flex-1 overflow-auto p-4 bg-muted/30 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap word-break'>
              {jsonString}
            </div>
            <div className='px-6 py-4 border-t border-border flex gap-2 justify-end'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setShowRaw(false)}
              >
                Cerrar
              </Button>
              <Button
                size='sm'
                onClick={() => {
                  navigator.clipboard.writeText(jsonString);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className='gap-1.5'
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

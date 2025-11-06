import React, { useState, useEffect } from 'react';
import { testJsonataExpression } from '../../utils/jsonataValidator';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { JsonViewer } from '@/components/Json/JsonViewer';

interface RuleSandboxProps {
  expression: string;
  isValid: boolean;
}

export const RuleSandbox: React.FC<RuleSandboxProps> = ({ expression, isValid }) => {
  const [contextJson, setContextJson] = useState<string>('{}');
  const [inputJson, setInputJson] = useState<string>('{}');
  const [outputObject, setOutputObject] = useState<unknown>(null);
  const [error, setError] = useState<string>('');
  const [isInputJsonValid, setIsInputJsonValid] = useState(true);
  const [isContextJsonValid, setIsContextJsonValid] = useState(true);

  // Auto-execute whenever expression, validity, or inputs change
  useEffect(() => {
    const executeExpression = async () => {
      if (!expression.trim()) {
        setOutputObject(null);
        setError('');
        return;
      }

      try {
        setError('');

        // Parse context JSON
        let parsedCtx: unknown;
        try {
          parsedCtx = JSON.parse(contextJson);
          setIsContextJsonValid(true);
        } catch (e) {
          setIsContextJsonValid(false);
          setError('JSON Context is invalid');
          setOutputObject(null);
          return;
        }

        // Parse input JSON
        let parsedInput: unknown;
        try {
          parsedInput = JSON.parse(inputJson);
          setIsInputJsonValid(true);
        } catch (e) {
          setIsInputJsonValid(false);
          setError('JSON Input is invalid');
          setOutputObject(null);
          return;
        }

        // If expression is invalid, show error but keep inputs
        if (!isValid) {
          setError('The JSONata expression contains errors. Correct it to see the result.');
          setOutputObject(null);
          return;
        }

        // Execute expression with context available as $ctx
        const result = await testJsonataExpression(expression, parsedInput, parsedCtx);

        if (result.success) {
          setOutputObject(result.result);
          setError('');
        } else {
          setError(`Error: ${result.error}`);
          setOutputObject(null);
        }
      } catch (err: any) {
        setError(`Error: ${err.message}`);
        setOutputObject(null);
      }
    };

    executeExpression();
  }, [expression, isValid, inputJson, contextJson]);

  return (
    <div className='space-y-4'>
      <div className='space-y-1'>
        <h3 className='text-lg font-semibold'>🧪 Test Sandbox</h3>
        <p className='text-sm text-muted-foreground'>Changes in the expression are reflected in real time</p>
      </div>

      {/* First row: Context and Input */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Context Panel */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>🧩 Context (JSON) — accessible as $ctx</label>
            {isContextJsonValid && contextJson.trim() ? (
              <div className='flex items-center gap-1 text-xs text-green-600'>
                <CheckCircle size={14} />
                Valid
              </div>
            ) : !isContextJsonValid && contextJson.trim() ? (
              <div className='flex items-center gap-1 text-xs text-destructive'>
                <AlertCircle size={14} />
                Invalid
              </div>
            ) : null}
          </div>

          <textarea
            value={contextJson}
            onChange={(e) => setContextJson(e.target.value)}
            placeholder={'{\n  "user": { "id": "123" }\n}'}
            rows={12}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
              !isContextJsonValid && contextJson.trim()
                ? 'border-destructive bg-destructive/5'
                : 'border-input'
            }`}
          />
        </div>

        {/* Input Panel */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>📥 Input Data (JSON)</label>
            {isInputJsonValid && inputJson.trim() ? (
              <div className='flex items-center gap-1 text-xs text-green-600'>
                <CheckCircle size={14} />
                Valid
              </div>
            ) : !isInputJsonValid && inputJson.trim() ? (
              <div className='flex items-center gap-1 text-xs text-destructive'>
                <AlertCircle size={14} />
                Invalid
              </div>
            ) : null}
          </div>

          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder={'{\n  "key": "value"\n}'}
            rows={12}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
              !isInputJsonValid && inputJson.trim()
                ? 'border-destructive bg-destructive/5'
                : 'border-input'
            }`}
          />
        </div>
      </div>

      {/* Second row: Result with JsonViewer */}
      <div className='space-y-2'>

        {error ? (
          <Alert className='border-destructive bg-destructive/5'>
            <AlertCircle className='h-4 w-4 text-destructive' />
            <AlertDescription className='text-destructive text-xs'>{error}</AlertDescription>
          </Alert>
        ) : outputObject !== null ? (
          <JsonViewer data={outputObject as Record<string, unknown>} title='📤 Result' open />
        ) : (
          <div className='flex items-center justify-center h-48 border border-dashed border-muted-foreground/30 rounded-md bg-muted/20'>
            <p className='text-sm text-muted-foreground'>The result will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

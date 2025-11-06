import { useState, useEffect } from 'react';
import { validateJsonata, ValidationError } from '@/utils/jsonataValidator';
import { RuleSandbox } from '@/components/Rules/RuleSandbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const RuleEditor = () => {
  const [expression, setExpression] = useState('');
  const [jsonataErrors, setJsonataErrors] = useState<ValidationError[]>([]);
  const [jsonataWarnings, setJsonataWarnings] = useState<ValidationError[]>([]);
  const [isJsonataValid, setIsJsonataValid] = useState(true);

  useEffect(() => {
    if (expression.trim()) {
      const result = validateJsonata(expression);
      setJsonataErrors(result.errors);
      setJsonataWarnings(result.warnings);
      setIsJsonataValid(result.isValid);
    } else {
      setJsonataErrors([]);
      setJsonataWarnings([]);
      setIsJsonataValid(true);
    }
  }, [expression]);

  return (
    <>
      <div className='border-b bg-primary text-white p-6'>
        <h2 className='text-2xl font-bold'>JSONata Editor</h2>
      </div>

      <div className='flex-1 overflow-y-auto p-6 space-y-6'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label htmlFor='expression' className='text-sm font-medium'>
              JSONata Expression
            </label>
            {isJsonataValid && expression.trim() && (
              <div className='flex items-center gap-1 text-xs text-green-600'>
                <CheckCircle size={14} />
                Valid
              </div>
            )}
            {!isJsonataValid && expression.trim() && (
              <div className='flex items-center gap-1 text-xs text-destructive'>
                <AlertCircle size={14} />
                Errors found
              </div>
            )}
          </div>

          <textarea
            id='expression'
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder={'${ "key": "value" }'}
            rows={10}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
              !isJsonataValid ? 'border-destructive bg-destructive/5' : 'border-input'
            }`}
          />

          {/* Validation Messages */}
          {jsonataErrors.length > 0 && (
            <div className='space-y-2'>
              {jsonataErrors.map((error, idx) => (
                <Alert key={idx} className='border-destructive bg-destructive/5'>
                  <AlertCircle className='h-4 w-4 text-destructive' />
                  <AlertDescription className='text-destructive text-xs ml-2'>
                    Line {error.line}, Column {error.column}: {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Warnings */}
          {jsonataWarnings.length > 0 && (
            <div className='space-y-2'>
              {jsonataWarnings.map((warning, idx) => (
                <Alert key={idx} className='border-yellow-500/50 bg-yellow-500/5'>
                  <AlertCircle className='h-4 w-4 text-yellow-600' />
                  <AlertDescription className='text-yellow-700 text-xs ml-2'>
                    Line {warning.line}, Column {warning.column}: {warning.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <p className='text-xs text-muted-foreground'>
            Write your JSONata expression here. Learn more in{' '}
            <a
              href='https://docs.jsonata.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              the official documentation
            </a>
          </p>
        </div>

        <RuleSandbox expression={expression} isValid={isJsonataValid} />
      </div>
    </>
  );
};

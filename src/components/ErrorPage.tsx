import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = (path: string) => window.location.href = path;

  // Determinar si es un error de ruta (404, etc.)
  const isRouteError = isRouteErrorResponse(error);
  
  const status = isRouteError ? error.status : 500;
  const statusText = isRouteError ? error.statusText : 'Error';
  const message = isRouteError ? error.data?.message : 'Ha ocurrido un error inesperado';

  return (
    <div className='flex flex-col h-screen bg-background items-center justify-center gap-6 px-6'>
      {/* Error Icon */}
      <div className='text-center'>
        <div className='flex justify-center mb-6'>
          <div className='w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center'>
            <AlertTriangle size={48} className='text-destructive' />
          </div>
        </div>
        
        <h1 className='text-6xl font-bold text-foreground mb-2'>{status}</h1>
        <h2 className='text-2xl font-semibold text-foreground mb-3'>{statusText}</h2>
        
        <p className='text-lg text-muted-foreground max-w-md mb-6'>
          {status === 404 
            ? 'La página que buscas no existe o ha sido movida.'
            : message || 'Lo sentimos, algo salió mal.'}
        </p>

        {/* Error Details */}
        {!isRouteError && error instanceof Error && (
          <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 text-left max-w-md'>
            <p className='text-sm font-mono text-destructive break-words'>
              {error.message}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className='flex gap-3 flex-wrap justify-center'>
        <Button
          variant='outline'
          onClick={() => window.history.back()}
          className='gap-2'
        >
          Volver atrás
        </Button>
        <Button
          onClick={() => navigate('/')}
          className='gap-2'
        >
          <Home size={18} />
          Ir a inicio
        </Button>
      </div>

      {/* Decorative background */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-destructive/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-destructive/5 rounded-full blur-3xl' />
      </div>
    </div>
  );
};

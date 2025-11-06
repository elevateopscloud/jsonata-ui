import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col h-full bg-background items-center justify-center gap-6 px-6'>
      {/* 404 Icon */}
      <div className='text-center'>
        <h1 className='text-8xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-3xl font-bold text-foreground mb-2'>Página no encontrada</h2>
        <p className='text-lg text-muted-foreground max-w-md'>
          Lo sentimos, la página que intentas acceder no existe o ha sido movida.
        </p>
      </div>

      {/* Actions */}
      <div className='flex gap-3 flex-wrap justify-center'>
        <Button
          variant='outline'
          onClick={() => navigate(-1)}
          className='gap-2'
        >
          <ArrowLeft size={18} />
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
        <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl' />
      </div>
    </div>
  );
};

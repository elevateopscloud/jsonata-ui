import { ModeToggle } from '@/components/ui/mode-toggle';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <ModeToggle />
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4 max-w-full overflow-hidden min-w-0 min-h-0'>
        <div className='bg-muted/50 flex-1 rounded-xl max-w-full overflow-hidden min-w-0 min-h-0 h-full'>
          <Outlet />
        </div>
      </div>
    </>
  );
}

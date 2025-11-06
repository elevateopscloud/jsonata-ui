import { ThemeProvider } from './components/ThemeProvider';
import { routes } from './routes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Normalize basename to avoid values like '/./' when Vite base is './'
const rawBase = (import.meta as any).env?.BASE_URL as string | undefined;
const envBasename = (import.meta as any).env?.VITE_ROUTER_BASENAME as string | undefined;
const normalizedBasename = envBasename ?? (rawBase === '/' || rawBase === './' ? undefined : rawBase);

const router = createBrowserRouter(routes, { basename: normalizedBasename });

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

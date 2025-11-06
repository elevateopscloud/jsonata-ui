import { ThemeProvider } from './components/ThemeProvider';
import { routes } from './routes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter(routes);

function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

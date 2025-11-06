import { RouteObject } from 'react-router-dom';
import MainLayout from '@/layout/Main';
import { ErrorPage } from '@/components/ErrorPage';
import { RuleEditor } from '@/components/Rules/RuleEditor';

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <RuleEditor />,
      }
    ],
  },
];

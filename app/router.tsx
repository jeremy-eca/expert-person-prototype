import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { IndexPage } from "./routes-components/IndexPage";
import { PersonDetailPage } from "./routes-components/PersonDetailPage";
import { NewPersonPage } from "./routes-components/NewPersonPage";
import { ApiTestPage } from "./routes-components/ApiTestPage";

// Centralized router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>
          <p className="text-gray-600 mb-4">An error occurred while loading this page.</p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go back to home
          </a>
        </div>
      </div>
    ),
  },
  {
    path: "/profile/:id",
    element: <PersonDetailPage />,
  },
  {
    path: "/profile/new",
    element: <NewPersonPage />,
  },
  {
    path: "/api-test",
    element: <ApiTestPage />,
  },
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go back to home
          </a>
        </div>
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default router;
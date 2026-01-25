import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import Loading from "./components/Loading.jsx";

const EventsPage = lazy(() => import("./pages/EventsPage.jsx"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage.jsx"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage.jsx"));
const ResourceDetailPage = lazy(() => import("./pages/ResourceDetailPage.jsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.jsx"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage.jsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="events/:slug" element={<EventDetailPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route
                    path="projects/:slug"
                    element={<ProjectDetailPage />}
                  />
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route
                    path="resources/:slug"
                    element={<ResourceDetailPage />}
                  />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;

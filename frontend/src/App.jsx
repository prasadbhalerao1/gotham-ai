import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import ResourceDetailPage from "./pages/ResourceDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

// Only the contact form talks to the backend; all content is static.
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

// Pages are imported eagerly so every route can be prerendered to HTML.
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:slug" element={<EventDetailPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="resources/:slug" element={<ResourceDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

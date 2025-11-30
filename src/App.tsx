import { useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Loader2 } from "lucide-react";

// Eager load critical components
import Splash from "./pages/Splash";

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const Places = lazy(() => import("./pages/Places"));
const PlaceDetail = lazy(() => import("./pages/PlaceDetail"));
const CreatePlace = lazy(() => import("./pages/CreatePlace"));
const EditPlace = lazy(() => import("./pages/EditPlace"));
const Randomizer = lazy(() => import("./pages/Randomizer"));
const Profile = lazy(() => import("./pages/Profile"));
const Install = lazy(() => import("./pages/Install"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Memuat halaman...</p>
    </div>
  </div>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Tampilkan splash screen saat pertama kali load
  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  // Setelah splash selesai, tampilkan aplikasi utama
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Layout><Home /></Layout>} />
              <Route path="/places" element={<Layout><Places /></Layout>} />
              <Route path="/place/:id" element={<PlaceDetail />} />
              <Route path="/create-place" element={<Layout><CreatePlace /></Layout>} />
              <Route path="/edit-place/:id" element={<Layout><EditPlace /></Layout>} />
              <Route path="/randomizer" element={<Layout><Randomizer /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="/install" element={<Install />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

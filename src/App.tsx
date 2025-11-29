import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Places from "./pages/Places";
import PlaceDetail from "./pages/PlaceDetail";
import CreatePlace from "./pages/CreatePlace";
import EditPlace from "./pages/EditPlace";
import Randomizer from "./pages/Randomizer";
import Profile from "./pages/Profile";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

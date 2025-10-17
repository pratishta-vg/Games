import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Leaderboard from "./pages/Leaderboard";
import Subjects from "./pages/Subjects";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import HistoryShootingGame from "./pages/HistoryShootingGame";
import PikachuScienceSurvival from "./pages/PikachuScienceSurvival";
import MathShooterGame from "./pages/MathShooterGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/history-shooting" element={<HistoryShootingGame />} />
            <Route path="/games/pikachu-science" element={<PikachuScienceSurvival />} />
            <Route path="/games/math-shooter" element={<MathShooterGame />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

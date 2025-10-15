import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MarketProvider } from "@/contexts/MarketContext";
import { Footer } from "@/components/ui/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Documents from "./pages/Documents";
import Finance from "./pages/Finance";
import Auth from "./pages/Auth";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMarkets from "./pages/admin/AdminMarkets";
import AdminDocuments from "./pages/admin/AdminDocuments";
import FindMarkets from "./pages/FindMarkets";
import MarketProfile from "./pages/MarketProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <MarketProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/markets" element={<AdminMarkets />} />
                  <Route path="/admin/documents" element={<AdminDocuments />} />
                  <Route path="/find-markets" element={<FindMarkets />} />
                  <Route path="/market/:id" element={<MarketProfile />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </MarketProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

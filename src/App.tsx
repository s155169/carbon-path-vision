
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CarbonFee from "./pages/CarbonFee";
import ReductionPath from "./pages/ReductionPath";
import ReductionActions from "./pages/ReductionActions";
import Guidelines from "./pages/Guidelines";
import GuidelinesComparison from "./pages/GuidelinesComparison";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/carbon-fee" element={<CarbonFee />} />
          <Route path="/reduction-path" element={<ReductionPath />} />
          <Route path="/reduction-actions" element={<ReductionActions />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/guidelines/compare" element={<GuidelinesComparison />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

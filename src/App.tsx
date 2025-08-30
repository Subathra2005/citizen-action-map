import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import UserSignup from "./pages/Auth/UserSignup";
import AdminSignup from "./pages/Auth/AdminSignup";
import RaiseProblem from "./pages/User/RaiseProblem";
import CheckStatus from "./pages/User/CheckStatus";
import Heatmaps from "./pages/User/Heatmaps";
import AdminHome from "./pages/Admin/AdminHome";
import IssueManagement from "./pages/Admin/IssueManagement";
import MyProblems from "./pages/Admin/MyProblems";
import AdminProfile from "./pages/Admin/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user-signup" element={<UserSignup />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/raise-problem" element={<RaiseProblem />} />
            <Route path="/check-status" element={<CheckStatus />} />
            <Route path="/heatmaps" element={<Heatmaps />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/issues" element={<IssueManagement />} />
            <Route path="/admin/my-problems" element={<MyProblems />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;

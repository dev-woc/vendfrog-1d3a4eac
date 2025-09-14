import { useState, useEffect } from "react";
import { Bell, LogOut, Moon, Sun, Calendar, FileText, DollarSign, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { LocationTicker } from "@/components/ui/LocationTicker";
import { AlertsDropdown } from "@/components/dashboard/AlertsDropdown";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  vendorName?: string;
}

export function DashboardHeader({ vendorName }: DashboardHeaderProps) {
  const { setTheme, theme } = useTheme();
  const [userProfile, setUserProfile] = useState<{ full_name: string; } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getDisplayName = () => {
    if (vendorName) return vendorName;
    if (userProfile?.full_name) return userProfile.full_name;
    return "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = getDisplayName();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-6">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">VendFrog</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link 
              to="/markets" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Markets
            </Link>
            <span className="text-muted-foreground text-xs">|</span>
            <Link 
              to="/documents" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Documents
            </Link>
            <span className="text-muted-foreground text-xs">|</span>
            <Link 
              to="/finance" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Finance
            </Link>
            <span className="text-muted-foreground text-xs">|</span>
            <Link 
              to="/help" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </Link>
          </nav>
          
          <div className="hidden xl:block text-xs sm:text-sm text-muted-foreground">
            Welcome back, {displayName}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden lg:block">
            <LocationTicker />
          </div>
          
          <AlertsDropdown />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src="/avatar.jpg" alt={displayName} />
                  <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link to="/markets" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Markets</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/documents" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Documents</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/finance" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Finance</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/help" className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/auth';
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
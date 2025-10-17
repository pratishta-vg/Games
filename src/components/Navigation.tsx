import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  BookOpen, 
  User, 
  Settings,
  Menu,
  X,
  GraduationCap,
  LogIn,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth";
import AuthModal from "./AuthModal";
import ApiSettings from "./ApiSettings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const currentUser = AuthService.getCurrentUser();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Subjects", href: "/subjects", icon: BookOpen },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GameLearn
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Auth and Settings */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Hi, {currentUser?.full_name?.split(' ')[0]}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      AuthService.logout();
                      setIsAuthenticated(false);
                      window.location.reload();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
              
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>API Settings</DialogTitle>
                  </DialogHeader>
                  <ApiSettings />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                GameLearn
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <div className="fixed top-16 left-0 right-0 bg-card border-b border-border p-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth modal (rendered for all viewports) */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          window.location.reload();
        }}
      />
    </>
  );
};

export default Navigation;
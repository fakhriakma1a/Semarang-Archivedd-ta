import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MapPin, Dices, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/places', icon: MapPin, label: 'Places' },
    { path: '/randomizer', icon: Dices, label: 'Random' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
                <Icon 
                  className={cn(
                    'w-5 h-5 mb-1 transition-all duration-200',
                    isActive && 'scale-110'
                  )} 
                />
                <span className={cn(
                  'text-xs font-medium transition-all duration-200',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Add Button - Mobile Only */}
      <Button
        onClick={() => navigate('/create-place')}
        size="icon"
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full shadow-lg md:hidden gradient-hero border-0"
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>

      {/* Desktop Top Navigation */}
      <nav className="hidden md:block border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/LOGOSA.png" alt="Semarang Archived" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-bold text-lg">Semarang Archived</span>
            </Link>
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Button
                onClick={() => navigate('/create-place')}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambahkan Tempat
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

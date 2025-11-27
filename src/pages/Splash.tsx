import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8 animate-slide-up">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <MapPin className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Semarang Archived
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Simpan Tempat Menarik di Semarang
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default Splash;

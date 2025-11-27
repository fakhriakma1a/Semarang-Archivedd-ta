import { useEffect, useState } from 'react';
import { Download, Check, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          {isInstalled ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Sudah Terinstall!</h2>
              <p className="text-muted-foreground mb-6">
                Semarang Archived sudah terinstall di perangkat Anda. Selamat
                menggunakan!
              </p>
              <Button asChild className="w-full">
                <a href="/">Buka Aplikasi</a>
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Install Aplikasi</h2>
              <p className="text-muted-foreground mb-6">
                Install Semarang Archived untuk pengalaman yang lebih baik.
                Aplikasi dapat digunakan offline dan seperti aplikasi native!
              </p>

              {deferredPrompt ? (
                <Button
                  onClick={handleInstallClick}
                  size="lg"
                  className="w-full gradient-hero border-0"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Install Sekarang
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Untuk menginstall aplikasi ini:
                  </p>
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="font-semibold mr-2">iOS/Safari:</span>
                      <span>Tap Share → Add to Home Screen</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold mr-2">Android:</span>
                      <span>Tap menu (⋮) → Add to Home screen</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;

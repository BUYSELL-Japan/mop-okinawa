import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 1000); // Increased fade-out duration to 1 second
    }, 3000); // Increased display time to 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] flex items-center justify-center transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="relative w-24 h-24 animate-[shake_1s_ease-in-out_infinite]">
        <img
          src="https://s3geojsonnew.s3.ap-southeast-2.amazonaws.com/PWAアイコン/mop192beta.png"
          alt="MOP Logo"
          className="w-full h-full object-contain"
        />
        <div className="absolute -bottom-1 inset-x-0 h-4 bg-gradient-to-t from-black/10 to-transparent rounded-full blur-sm"></div>
      </div>
    </div>
  );
}
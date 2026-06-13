import React, { useState, useEffect } from "react";

// Simple global cache to avoid refetching on every single avatar mount
let globalExistingImages: string[] | null = null;
let globalPendingPromise: Promise<string[]> | null = null;

const fetchExistingImages = (): Promise<string[]> => {
  if (globalExistingImages !== null) {
    return Promise.resolve(globalExistingImages);
  }
  if (globalPendingPromise !== null) {
    return globalPendingPromise;
  }
  globalPendingPromise = fetch("/api/existing-images")
    .then((res) => res.json())
    .then((data) => {
      globalExistingImages = (data && data.success && Array.isArray(data.files)) ? data.files : [];
      return globalExistingImages;
    })
    .catch((err) => {
      console.error("Error fetching local images:", err);
      globalExistingImages = [];
      return [];
    });
  return globalPendingPromise;
};

interface LegendAvatarProps {
  name: string;
  className?: string;
  imgClassName?: string;
}

export const LegendAvatar: React.FC<LegendAvatarProps> = ({ 
  name, 
  className = "w-full h-full", 
  imgClassName = "w-full h-full object-cover" 
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  useEffect(() => {
    setIsLoading(true);
    fetchExistingImages().then((files) => {
      // Find matches
      const match = files.find((f) => {
        const dotIdx = f.lastIndexOf(".");
        const base = dotIdx !== -1 ? f.substring(0, dotIdx) : f;
        return base.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanName;
      });

      if (match) {
        setImgSrc(`/images/${match}`);
      } else {
        setImgSrc(null);
      }
      setIsLoading(false);
    });
  }, [name]);

  if (isLoading) {
    return (
      <div className={`w-full h-full bg-[#f0f2f5] dark:bg-[#1a100c] flex items-center justify-center overflow-hidden select-none ${className}`}>
        <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!imgSrc) {
    // Render high-fidelity Facebook-themed "half-donut" silhouette avatar
    return (
      <div className={`w-full h-full bg-[#f0f2f5] dark:bg-[#251e18] flex items-center justify-center overflow-hidden select-none ${className}`} id={`avatar-placeholder-container-${cleanName}`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-[#bcc0c4] dark:text-[#55473c] fill-current transition-colors duration-300"
          id={`avatar-placeholder-svg-${cleanName}`}
        >
          {/* Head (perfect circle) */}
          <circle cx="50" cy="35" r="17" />
          
          {/* Shoulders (smooth curved "half-donut" / crescent hump) */}
          <path d="M 20 85 C 20 62, 32 58, 50 58 C 68 58, 80 62, 80 85 Z" />
        </svg>
      </div>
    );
  }

  return (
    <img 
      id={`avatar-img-${cleanName}`}
      src={imgSrc} 
      alt={name} 
      className={imgClassName}
      referrerPolicy="no-referrer"
    />
  );
};

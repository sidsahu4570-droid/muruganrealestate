import React, { createContext, useContext, useState, useEffect } from 'react';

interface RecentlyViewedContextProps {
  recentlyViewed: any[];
  addToRecentlyViewed: (property: any) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextProps | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        setRecentlyViewed([]);
      }
    }
  }, []);

  const addToRecentlyViewed = (property: any) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item._id !== property._id);
      const updated = [property, ...filtered].slice(0, 6);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

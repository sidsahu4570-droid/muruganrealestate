import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

interface CompareContextProps {
  compareItems: any[];
  addToCompare: (property: any) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextProps | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<any[]>([]);
  const { showToast } = useToast();

  const addToCompare = (property: any) => {
    setCompareItems((prev) => {
      if (prev.some((item) => item._id === property._id)) {
        showToast('Property already in compare list', 'info');
        return prev;
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 properties side-by-side', 'warning');
        return prev;
      }
      showToast('Property added to compare list', 'success');
      return [...prev, property];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareItems((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      showToast('Property removed from compare list', 'info');
      return updated;
    });
  };

  const isInCompare = (id: string) => compareItems.some((item) => item._id === id);

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

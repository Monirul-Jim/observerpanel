import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PanelTab } from '@/components/panel/BottomNav';

interface PanelNavContextValue {
  activeTab: PanelTab;
  setActiveTab: (tab: PanelTab) => void;
}

const PanelNavContext = createContext<PanelNavContextValue | null>(null);

export function PanelNavProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<PanelTab>('home');

  return (
    <PanelNavContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </PanelNavContext.Provider>
  );
}

export function usePanelNav() {
  const ctx = useContext(PanelNavContext);
  if (!ctx) throw new Error('usePanelNav must be used within PanelNavProvider');
  return ctx;
}

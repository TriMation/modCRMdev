import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuSection } from '../types/menu';
import { getMenuSections, getMenuItems } from '../services/menuService';

interface MenuContextType {
  sections: MenuSection[];
  selectedSection: MenuSection | null;
  selectedSectionName: string;
  setSelectedSection: (section: MenuSection) => void;
  setSelectedSectionName: (name: string) => void;
  loading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<MenuSection | null>(null);
  const [selectedSectionName, setSelectedSectionName] = useState<string>('sales');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenuSections() {
      try {
        const data = await getMenuSections();
        setSections(data);

        if (data.length > 0) {
          const salesSection = data.find(s => s.name === selectedSectionName);
          if (salesSection) {
            setSelectedSection(salesSection);
          }
        }
      } catch (err) {
        setError('Failed to load menu sections');
        console.error('Error loading menu sections:', err);
      } finally {
        setLoading(false);
      }
    }
    void loadMenuSections();
  }, []);

  useEffect(() => {
    async function loadMenuItems() {
      if (!selectedSection?.id) return;

      try {
        const items = await getMenuItems(selectedSection.id);
        setSelectedSection(prev => prev ? { ...prev, items } : null);
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error loading menu items:', err);
      }
    }
    loadMenuItems();
  }, [selectedSection?.id]);

  const handleSectionChange = useCallback((section: MenuSection) => {
    if (section.name !== selectedSection?.name) {
      setSelectedSection(section);
      setSelectedSectionName(section.name);
    }
  }, [selectedSection?.name]);

  return (
    <MenuContext.Provider value={{ 
      sections, 
      selectedSection, 
      selectedSectionName,
      setSelectedSection: handleSectionChange,
      setSelectedSectionName,
      loading, 
      error 
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
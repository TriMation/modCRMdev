import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuSection } from '../types/menu';
import { getMenuSections, getMenuItems } from '../services/menuService';

interface MenuContextType {
  sections: MenuSection[];
  selectedSection: MenuSection | null;
  setSelectedSection: (section: MenuSection) => void;
  loading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<MenuSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenuSections() {
      try {
        const data = await getMenuSections();
        setSections(data);
        if (data.length > 0) {
          setSelectedSection(data[0]); // Default to first section
        }
      } catch (err) {
        setError('Failed to load menu sections');
        console.error('Error loading menu sections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenuSections();
  }, []);

  useEffect(() => {
    async function loadMenuItems() {
      if (!selectedSection) return;

      try {
        const items = await getMenuItems(selectedSection.id);
        setSelectedSection({ ...selectedSection, items });
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error loading menu items:', err);
      }
    }
    loadMenuItems();
  }, [selectedSection?.id]);

  const handleSectionChange = useCallback((section: MenuSection) => {
    // Only update if selecting a different section
    if (section.id !== selectedSection?.id) {
      setSelectedSection(section);
    }
  }, [selectedSection?.id]);

  return (
    <MenuContext.Provider value={{ 
      sections, 
      selectedSection, 
      setSelectedSection: handleSectionChange,
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
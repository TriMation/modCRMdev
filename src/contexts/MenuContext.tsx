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
        // Get first login flag from localStorage
        const isFirstLogin = !localStorage.getItem('hasLoggedIn');

        const data = await getMenuSections();
        setSections(data);

        // Get persisted section from localStorage
        const persistedSection = localStorage.getItem('selectedMenuSection');
        
        if (isFirstLogin) {
          // On first login, default to sales section
          const salesSection = data.find(s => s.name === 'sales');
          if (salesSection) {
            setSelectedSection(salesSection);
            localStorage.setItem('selectedMenuSection', JSON.stringify({
              name: salesSection.name,
              id: salesSection.id
            }));
          }
          // Set first login flag
          localStorage.setItem('hasLoggedIn', 'true');
        } else if (persistedSection) {
          const parsed = JSON.parse(persistedSection);
          const section = data.find(s => s.name === parsed.name);
          if (section) {
            setSelectedSection(section);
          }
        }
      } catch (err) {
        console.error('Error loading menu sections:', err);
        setError('Failed to load menu sections');
      } finally {
        setLoading(false);
      }
    }
    loadMenuSections();
  }, []);

  useEffect(() => {
    async function loadMenuItems() {
      if (!selectedSection?.id) return;

      try {
        const items = await getMenuItems(selectedSection.id);
        setSelectedSection(prev => prev ? { ...prev, items } : null);
      } catch (err) {
        console.error('Error loading menu items:', err);
        setError('Failed to load menu items');
      }
    }
    loadMenuItems();
  }, [selectedSection?.id]);

  const handleSectionChange = useCallback((section: MenuSection) => {
    try {
      // Store section in localStorage
      if (section) {
        localStorage.setItem('selectedMenuSection', JSON.stringify({
          name: section.name,
          id: section.id
        }));
      }
      setSelectedSection(section);
    } catch (err) {
      console.error('Error changing section:', err);
      setError('Failed to change section');
    }
  }, []);

  const value = {
    sections,
    selectedSection,
    setSelectedSection: handleSectionChange,
    loading,
    error
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
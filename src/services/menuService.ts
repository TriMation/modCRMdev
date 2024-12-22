import { supabase } from '../config/supabase';
import { MenuSection, MenuItem } from '../types/menu';

export async function getMenuSections(): Promise<MenuSection[]> {
  try {
    const { data: sections, error } = await supabase
      .from('menu_sections') 
      .select('*')
      .eq('active', true)
      .order('order_position');

    if (error) throw error;
    return sections || [];
  } catch (error) {
    console.error('Error fetching menu sections:', error);
    throw error;
  }
}

export async function getMenuItems(sectionId: string): Promise<MenuItem[]> {
  try {
    if (!sectionId) {
      console.warn('No section ID provided to getMenuItems');
      return [];
    }

    const { data: items, error } = await supabase
      .from('menu_items')
      .select(`
        id,
        name,
        path,
        icon,
        order_position,
        parent_id
      `)
      .eq('section_id', sectionId) 
      .eq('active', true)
      .order('order_position');

    if (error) throw error;

    return items?.map(item => ({
      ...item,
      children: []
    })) || [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
}
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
    const { data: items, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('section_id', sectionId)
      .eq('active', true)
      .order('order_position');

    if (error) throw error;

    // Organize items into a tree structure
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    items?.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    items?.forEach(item => {
      if (item.parent_id && itemMap.has(item.parent_id)) {
        const parent = itemMap.get(item.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(itemMap.get(item.id)!);
      } else {
        rootItems.push(itemMap.get(item.id)!);
      }
    });

    return rootItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
}
export interface MenuItem {
    id: string;
    name: string;
    path: string;
    icon?: string;
    order_position: number;
    parent_id?: string;
    children?: MenuItem[];
  }
  
  export interface MenuSection {
    id: string;
    name: string;
    icon?: string;
    order_position: number;
    items?: MenuItem[];
  }
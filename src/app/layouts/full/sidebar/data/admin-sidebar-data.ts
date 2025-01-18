import { NavItem } from "../nav-item/nav-item";


export const navItems: NavItem[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    bgcolor: 'error',
    route: '/admin',
  },
  {
    displayName: 'Talleres',
    iconName: 'building-store',
    bgcolor: 'error',
    route: '/admin/stores',
  },
  {
    displayName: 'Marcas',
    iconName: 'brand-toyota',
    bgcolor: 'error',
    route: '/admin/brands',
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    bgcolor: 'error',
    route: '/admin/users',
  },
  

];

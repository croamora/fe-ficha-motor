import { NavItem } from "../nav-item/nav-item";


export const navItems: NavItem[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/admin',
  },
  {
    displayName: 'Talleres',
    iconName: 'building-store',
    bgcolor: 'primary',
    route: '/admin/stores',
  },
  

];

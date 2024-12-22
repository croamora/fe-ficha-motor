import { NavItem } from "../nav-item/nav-item";

export const navItems: NavItem[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Mi Negocio',
    iconName: 'building-store',
    bgcolor: 'primary',
    route: '/store',
  },
  {
    displayName: 'Ordenes',
    iconName: 'checkup-list',
    bgcolor: 'primary',
    route: '/store/orders',
  },

];

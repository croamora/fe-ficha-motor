import { NavItem } from "../nav-item/nav-item";
export const navItems: NavItem[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Descubrir',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/descubrir',
  },
  {
    displayName: 'Mis Vehículos',
    iconName: 'car',
    bgcolor: 'primary',
    route: '/client/cars',
  },
  {
    displayName: 'Mis Servicios',
    iconName: 'checkup-list',
    bgcolor: 'primary',
    route: '/client/services',
  },
  
];

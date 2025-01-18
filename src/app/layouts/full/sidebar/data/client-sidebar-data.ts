import { NavItem } from "../nav-item/nav-item";
export const navItems: NavItem[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Locales',
    iconName: 'layout-dashboard',
    bgcolor: 'error',
    route: '/locales',
  },
  {
    displayName: 'Mis Vehículos',
    iconName: 'car',
    bgcolor: 'error',
    route: '/client/cars',
  },
  // {
  //   displayName: 'Mis Servicios',
  //   iconName: 'checkup-list',
  //   bgcolor: 'primary',
  //   route: '/client/services',
  // },
  
];

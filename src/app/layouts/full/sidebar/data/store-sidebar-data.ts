import { NavItem } from "../nav-item/nav-item";

export const navItems: NavItem[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Mi Negocio',
    iconName: 'building-store',
    bgcolor: 'error',
    route: '/store',
  },
  {
    displayName: 'Cotizaciones',
    iconName: 'file-dollar',
    bgcolor: 'error',
    route: '/store/cotizations',
  },
  {
    displayName: 'Ordenes de Trabajo',
    iconName: 'checkup-list',
    bgcolor: 'error',
    route: '/store/orders',
  },
  {
    displayName: 'Agenda',
    iconName: 'calendar-time',
    bgcolor: 'error',
    route: '/store/schedule',
  },
  
  {
    displayName: 'Configuraciones',
    iconName: 'settings-cog',
    bgcolor: 'error',
    children: [
      {
        displayName: 'Usuarios',
        iconName: 'users',
        bgcolor: 'accent',
        route: '/store/config/users',
      },
      {
        displayName: 'Disponibilidad',
        iconName: 'calendar-clock',
        bgcolor: 'accent',
        route: '/store/config/disponibility',
      },
      {
        displayName: 'Servicios',
        iconName: 'tool',
        bgcolor: 'accent',
        route: '/store/config/services',
      },
    ]
  },
];

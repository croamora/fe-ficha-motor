import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

import { navItems as defaultNavItems } from './sidebar/data/sidebar-data';
import { navItems as adminNavItems } from './sidebar/data/admin-sidebar-data';
import { navItems as clientNavItems } from './sidebar/data/client-sidebar-data';
import { navItems as storeNavItems } from './sidebar/data/store-sidebar-data';

import { NavService } from '../../services/nav.service';
import { AppNavItemComponent } from './sidebar/nav-item/nav-item.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './header/header.component';
import { AuthService } from 'src/app/services/auth.service';
import { NavItem } from './sidebar/nav-item/nav-item';
import { TallerService } from 'src/app/services/taller.service';
import { StorageService } from 'src/app/services/storage.service';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';


@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
    HeaderComponent,
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss',
  encapsulation: ViewEncapsulation.None,
})

export class FullComponent implements OnInit {

  navItems: NavItem[] = [];
  stores : any[] = [];
  selectedStore : any[] = [];

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | any;

  //get options from service
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  constructor(
    private breakpointObserver: BreakpointObserver, 
    private router: Router,
    private storageService: StorageService, 
    private authService : AuthService) {

    this.htmlElement = document.querySelector('html')!;
    this.htmlElement.classList.add('light-theme');
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes

        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];

        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
      });
  }

  ngOnInit(): void {
    this.stores = this.storageService.getStores();
    const storedSelectedStore = this.storageService.getSelectedStore();
    this.selectedStore = this.stores.find(store => store.id === storedSelectedStore?.id) || null;
    this.loadNavItemsBasedOnProfile();
  }


  // Cargar los navItems según el perfil
  private loadNavItemsBasedOnProfile(): void {
    const userProfile = this.authService.getProfileFromToken(); // Obtener perfil del token (o lo que sea necesario)
    
    switch (userProfile) {
      case 1: // Admin
        this.navItems = adminNavItems;
        break;
      case 2: // Client
        this.navItems = clientNavItems;
        break;
      case 3: // Store
        this.navItems = storeNavItems;
        break;
      default: // Si no se encuentra el perfil, cargar el navItems por defecto
        this.navItems = defaultNavItems;
        break;
    }
  }
  
  onOptionChange(event: any): void {
    this.selectedStore = event.value;
    this.storageService.saveSelectedStore(this.selectedStore);
    this.router.navigate(['/store']);
  }

  isUserStore(){
    return this.authService.isAuthenticated() 
              && this.authService.getProfileFromToken() === 3;
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe(); 
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }
}

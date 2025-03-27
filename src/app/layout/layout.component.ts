import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { DrawerModule } from 'primeng/drawer';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MenubarModule,
    DrawerModule,
    Menu,
    ButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  itemsHeader: MenuItem[] = [
    {
      icon: "pi pi-bars",
      command: () => {
        this.visible = !this.visible
      }
    }
  ];
  visible: boolean = false
  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: "/dashboard",
      command: () => {
        this.visible = !this.visible
      }
    },
    {
      label: 'Customers',
      icon: 'pi pi-users',
      routerLink: "/customers",
      command: () => {
        this.visible = !this.visible
      }
    },
    {
      label: 'Employees',
      icon: 'pi pi-users',
      routerLink: "/employees",
      command: () => {
        this.visible = !this.visible
      }
    },
    {
      label: 'Stock',
      icon: 'pi pi-shop',
      routerLink: "/stockDetails",
      command: () => {
        this.visible = !this.visible
      }
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      routerLink: "/orders",
      command: () => {
        this.visible = !this.visible
      }
    },
    {
      label: 'Sessions',
      icon: 'pi pi-clock',
      routerLink: "/sessions",
      command: () => {
        this.visible = !this.visible
      }
    },
    {
      label: 'Discount & Loyalty',
      icon: 'pi pi-credit-card',
      routerLink: "/discountDetails",
      command: () => {
        this.visible = !this.visible
      }
    }
  ];
}

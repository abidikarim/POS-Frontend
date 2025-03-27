import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Session } from '../../shared/models/session';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { CategoryOut } from '../../shared/models/category-out';
import { CategoryService } from '../../services/category/category.service';

@Component({
  selector: 'app-session',
  imports: [
    MenuModule,
    ButtonModule
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  session!: Session
  items: MenuItem[] = [
    {
      label: 'End Session',
      icon: 'pi pi-power-off'
    },
    {
      label: "Paused Session",
      icon: 'pi pi-pause-circle'
    }
  ]
  categories: CategoryOut[] = []
  categoriesItems: MenuItem[] = []
  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private categoryService: CategoryService
  ) {
    this.session = this.config.data
  }
}

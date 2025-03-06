import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryOut } from '../../shared/models/category-out';
import { ImageModule } from 'primeng/image';
import { PaginationParams } from '../../shared/models/pagination-params';
import { CategoryService } from '../../services/category/category.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    ImageModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  categories: CategoryOut[] = []
  total_records: number = 0
  rows: number = 10
  loading: boolean = true
  pg_params: PaginationParams = new PaginationParams()
  ref!: DynamicDialogRef
  searchForm: FormGroup

  constructor(
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      name: ['']
    })
    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
      this.onValueChanged(data)
    })
  }

  loadCategories() {
    this.categoryService.get(this.pg_params).subscribe({
      next: (res) => {
        this.categories = res.list
        this.total_records = res.total_records
        this.rows = res.page_size
        this.loading = false
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  ngOnInit() {
    this.loadCategories()
  }
  onPageChanged(event: any) {
    this.pg_params.page = event.first / event.rows + 1
    this.pg_params.limit = event.rows
    this.loadCategories()
  }
  showAddDialog() {
    this.ref = this.dialogService.open(AddCategoryComponent, {
      header: "Add Category",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      width: "400px"

    })
    this.ref.onClose.subscribe(() => {
      this.loadCategories()
    })
  }
  showEditDialog(category: any) {
    this.ref = this.dialogService.open(EditCategoryComponent, {
      header: "Edit Category",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      width: "400px",
      data: { category }
    })
    this.ref.onClose.subscribe(() => {
      this.loadCategories()
    })
  }
  deleteDialog(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete this category',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: "danger",
      },
      accept: () => {
        this.categoryService.delete(id).subscribe({
          next: (res) => {
            if (res.status_code == 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.detail });
              this.loadCategories()
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res.detail });
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
  onValueChanged(data: any) {
    this.pg_params = new PaginationParams(data.name, 1, this.pg_params.limit)
    this.loadCategories()
  }
}

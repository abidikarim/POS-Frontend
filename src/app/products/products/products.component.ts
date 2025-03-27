import { Component } from '@angular/core';
import { ProductOut } from '../../shared/models/product-out';
import { ProductService } from '../../services/product/product.service';
import { ProductFilter } from '../../shared/models/product-filter';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { ImportProductsComponent } from '../import-products/import-products.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ImageModule,
    ButtonModule,
    PaginatorModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: ProductOut[] = []
  filter: ProductFilter = new ProductFilter()
  form: FormGroup
  first: number = 0
  rows: number = 10
  total_records: number = 0
  ref!: DynamicDialogRef
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.fb.group({
      name: [''],
      category: [''],
      min_price: [null],
      max_price: [null],
      min_quantity: [null],
      max_quantity: [null]
    })
    this.form.valueChanges.pipe(debounceTime(1000)).subscribe((data) => {
      this.onValueChanged(data)
    })
  }

  ngOnInit() {
    this.loadProducts()
  }
  onValueChanged(data: any) {
    this.filter = new ProductFilter(1, this.filter.limit, data.name, data.category, data.min_price || 0, data.max_price || 0, data.min_quantity || 0, data.max_quantity || 0)
    this.loadProducts()
  }

  loadProducts() {
    this.productService.get(this.filter).subscribe({
      next: (res) => {
        if (res.status_code == 200) {
          this.products = res.list
          this.rows = res.page_size
          this.total_records = res.total_records
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onPageChange(event: any) {
    this.filter.page = event.first / event.rows + 1
    this.filter.limit = event.rows
    this.loadProducts()
  }
  showAddDialog() {
    this.ref = this.dialogService.open(AddProductComponent, {
      header: "Add Product",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadProducts()
    })
  }
  showImportDialog() {
    this.ref = this.dialogService.open(ImportProductsComponent, {
      header: "Import Products",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadProducts()
    })
  }
  showEditDialog(product: ProductOut) {
    this.ref = this.dialogService.open(EditProductComponent, {
      header: "Edit Product",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: { product }
    })
    this.ref.onClose.subscribe(() => {
      this.loadProducts()
    })
  }
  delete(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this product?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.productService.delete(id).subscribe({
          next: (res) => {
            if (res.status_code == 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.detail });
              this.loadProducts()
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res.detail });
            }
          },
          error: (error) => {
            console.log(error)
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }
}

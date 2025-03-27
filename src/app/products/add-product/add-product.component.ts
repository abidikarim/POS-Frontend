import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryOut } from '../../shared/models/category-out';
import { SelectModule } from 'primeng/select';
import { CategoryService } from '../../services/category/category.service';
import { PaginationParams } from '../../shared/models/pagination-params';
import { ProductService } from '../../services/product/product.service';
import { ProductBase } from '../../shared/models/product-base';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { handleForm } from '../../shared/utilities/handle-form';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-product',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    FileUploadModule,
    SelectModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  productForm: FormGroup
  selectedImage: File | undefined
  imageError: boolean = false
  loading: boolean = false
  categories!: CategoryOut[]
  @ViewChild("image") imageInput!: FileUpload
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      category_id: ['', [Validators.required]],
    })
    this.categoryService.get(new PaginationParams()).subscribe({
      next: (res) => {
        if (res.status_code == 200) {
          this.categories = res.list
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onSubmit() {
    this.imageError = !this.selectedImage
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched()
      return
    }
    this.loading = true
    const product: ProductBase = deepCopy(handleForm(this.productForm.value))
    this.productService.add(product, this.selectedImage).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 201) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          this.ref.close()
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: res.detail })
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onSelect(event: FileSelectEvent) {
    this.selectedImage = event.files[0]
    this.imageError = false
  }
  onRemove() {
    this.selectedImage = undefined
    this.imageInput.clear()
  }
}

import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CategoryOut } from '../../shared/models/category-out';
import { FileSelectEvent, FileUploadModule, FileUpload } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ProductOut } from '../../shared/models/product-out';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from '../../services/category/category.service';
import { PaginationParams } from '../../shared/models/pagination-params';
import { ProductService } from '../../services/product/product.service';
import { ProductBase } from '../../shared/models/product-base';
import { handleForm } from '../../shared/utilities/handle-form';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-product',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    FileUploadModule,
    InputTextModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  productForm: FormGroup
  loading: boolean = false
  categories: CategoryOut[] = []
  selectedImage: File | undefined
  product: ProductOut
  @ViewChild("image") inputImage!: FileUpload
  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private categoriesService: CategoryService,
    private productService: ProductService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.product = this.config.data.product
    this.productForm = this.fb.group({
      name: [this.product?.name || null, [Validators.required]],
      description: [this.product?.description || null, [Validators.required]],
      price: [this.product?.price || null, [Validators.required, Validators.min(1)]],
      quantity: [this.product?.quantity || null, [Validators.required, Validators.min(1)]],
      category_id: [this.product?.category_id || null, [Validators.required]],
    })
    this.categoriesService.get(new PaginationParams()).subscribe({
      next: (res) => {
        this.categories = res.list
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched()
      return
    }
    this.loading = true
    const data: ProductBase = handleForm(deepCopy(this.productForm.value))
    this.productService.edit(data, this.selectedImage, this.product.id).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 200) {
          this.messageService.add({ summary: "Success", severity: "success", detail: res.detail })
          this.ref.close()
        } else {
          this.messageService.add({ summary: "Error", severity: "error", detail: res.detail })
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onSelect(event: FileSelectEvent) {
    debugger
    this.selectedImage = event.files[0]
  }
  onRemove() {
    debugger
    this.selectedImage = undefined
    this.inputImage.clear()
  }

}

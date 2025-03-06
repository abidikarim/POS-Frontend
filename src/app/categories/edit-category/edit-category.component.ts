import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryOut } from '../../shared/models/category-out';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryBase } from '../../shared/models/category-base';
import { CategoryService } from '../../services/category/category.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-category',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule
  ],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
  categoryForm: FormGroup
  category!: CategoryOut
  loading: boolean = false
  selectedLogo: File | undefined
  @ViewChild("icon") iconInput!: FileUpload

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.category = this.config.data.category
    this.categoryForm = this.fb.group({
      name: [this.category?.name || null, [Validators.required]],
      description: [this.category?.description || null, [Validators.required]]
    })
  }


  onSelect(event: FileSelectEvent) {
    debugger
    this.selectedLogo = event.files[0]
  }
  onRemove() {
    this.selectedLogo = undefined
    this.iconInput.clear()
  }
  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched()
      return
    }
    this.loading = true
    const data: CategoryBase = this.categoryForm.value
    this.categoryService.edit(data, this.selectedLogo, this.category.id).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 200) {
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
}

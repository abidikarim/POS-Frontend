import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryService } from '../../services/category/category.service';
import { CategoryBase } from '../../shared/models/category-base';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { handleForm } from '../../shared/utilities/handle-form';

@Component({
  selector: 'app-add-category',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  categoryForm: FormGroup
  loading: boolean = false
  selectedIcon?: File
  iconError: boolean = false
  @ViewChild("icon") iconInput!: FileUpload

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,

  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }

  onSelect(event: FileSelectEvent) {
    this.selectedIcon = event.files[0]
    this.iconError = false
  }
  onRemove() {
    this.selectedIcon = undefined
    this.iconInput.clear()
  }
  onSubmit() {
    this.iconError = !this.selectedIcon;
    if (this.categoryForm.invalid || this.iconError) {
      this.categoryForm.markAllAsTouched()
      return
    }
    this.loading = true
    const data: CategoryBase = deepCopy(handleForm(this.categoryForm.value))
    this.categoryService.add(data, this.selectedIcon).subscribe({
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
}

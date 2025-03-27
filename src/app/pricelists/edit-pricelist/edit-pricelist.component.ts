import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PricelistService } from '../../services/pricelist/pricelist.service';
import { PriceList } from '../../shared/models/pricelist';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PricelistBase } from '../../shared/models/pricelist-base';

@Component({
  selector: 'app-edit-pricelist',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './edit-pricelist.component.html',
  styleUrl: './edit-pricelist.component.css'
})
export class EditPricelistComponent {
  editForm!: FormGroup
  loading: boolean = false
  pricelist!: PriceList

  constructor(
    private fb: FormBuilder,
    private pricelistService: PricelistService,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.pricelist = this.config.data
    this.editForm = this.fb.group({
      name: [this.pricelist.name || null, [Validators.required]],
      description: [this.pricelist.description || null, [Validators.required]]
    })
  }
  onSubmit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched()
      return
    }
    this.loading = true
    const pricelist_data: PricelistBase = deepCopy(this.editForm.value)
    this.pricelistService.edit(pricelist_data, this.pricelist.id).subscribe({
      next: res => {
        this.loading = false
        if (res.status_code == 200) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          this.ref.close()
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: res.detail })
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }
}

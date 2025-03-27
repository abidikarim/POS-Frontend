import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PricelistBase } from '../../shared/models/pricelist-base';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { PricelistService } from '../../services/pricelist/pricelist.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-pricelist',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './add-pricelist.component.html',
  styleUrl: './add-pricelist.component.css'
})
export class AddPricelistComponent {
  addForm!: FormGroup
  loading: boolean = false
  constructor(
    private fb: FormBuilder,
    private pricelistService: PricelistService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]]
    })
  }
  onSubmit() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched()
      return
    }
    this.loading = true
    const priclist: PricelistBase = deepCopy(this.addForm.value)
    this.pricelistService.add(priclist).subscribe({
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

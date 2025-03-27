import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Customer } from '../../shared/models/customer';
import { emailValidator } from '../../shared/validators/email-validator.validator';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PriceList } from '../../shared/models/pricelist';
import { PricelistService } from '../../services/pricelist/pricelist.service';
import { CustomerService } from '../../services/customer/customer.service';
import { MessageService } from 'primeng/api';
import { deepCopy } from '../../shared/utilities/deepCopy';

@Component({
  selector: 'app-edit-customer',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {
  editForm!: FormGroup
  customer!: Customer
  loading: boolean = false
  pricelists!: PriceList[]
  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private pricelistService: PricelistService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.customer = this.config.data
    this.editForm = this.fb.group({
      name: [this.customer.name || null, [Validators.required]],
      email: [this.customer.email || null, [Validators.required, emailValidator]],
      pricelist_id: [this.customer.pricelist_id || null]
    })
    this.pricelistService.get().subscribe({
      next: res => {
        this.pricelists = res
      },
      error: error => {
        console.log(error)
      }
    })
  }
  onSubmit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched()
      return
    }
    this.loading = true
    const customer: Customer = deepCopy(this.editForm.value)
    this.customerService.edit(customer, this.customer.id).subscribe({
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

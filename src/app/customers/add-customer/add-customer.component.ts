import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PriceList } from '../../shared/models/pricelist';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { emailValidator } from '../../shared/validators/email-validator.validator';
import { last } from 'rxjs';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { Customer } from '../../shared/models/customer';
import { CustomerService } from '../../services/customer/customer.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { PricelistService } from '../../services/pricelist/pricelist.service';

@Component({
  selector: 'app-add-customer',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {
  pricelists: PriceList[] = []
  loading: boolean = false
  addForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private pricelistService: PricelistService
  ) {
    this.addForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, emailValidator]],
      pricelist_id: []
    })
    this.loadPricelists()
  }
  loadPricelists() {
    this.pricelistService.get().subscribe({
      next: (res) => {
        this.pricelists = res
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onSubmit() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched()
      return
    }
    this.loading = true
    const customer: Customer = deepCopy(this.addForm.value)
    this.customerService.add(customer).subscribe({
      next: res => {
        this.loading = false
        if (res.status_code == 201) {
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

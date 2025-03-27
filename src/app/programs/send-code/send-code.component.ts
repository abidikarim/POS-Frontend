import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectFilterEvent, SelectModule } from 'primeng/select';
import { EmployeeService } from '../../services/employee/employee.service';
import { PaginationParams } from '../../shared/models/pagination-params';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { GiftCard } from '../../shared/models/gift-card';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { ProgramService } from '../../services/program/program.service';
import { debounceTime, Subject } from 'rxjs';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-send-code',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './send-code.component.html',
  styleUrl: './send-code.component.css'
})
export class SendCodeComponent {
  customers: any[] = []
  filter: PaginationParams = new PaginationParams()
  code_id!: number
  sendForm!: FormGroup
  loading: boolean = false
  subjectCustomerFilter = new Subject<string>()
  constructor(
    private customerService: CustomerService,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private messageService: MessageService,
    private programService: ProgramService,
    private ref: DynamicDialogRef
  ) {
    this.code_id = this.config.data
    this.sendForm = this.fb.group({
      customer_id: [null, [Validators.required]],
      code_id: [this.code_id]
    })
    this.subjectCustomerFilter.pipe(debounceTime(1000)).subscribe((data) => {
      this.filter.name = data
      this.loadCusmtomers()
    })
  }
  ngOnInit() {
    this.loadCusmtomers()
  }
  loadCusmtomers() {
    this.customerService.get(this.filter).subscribe({
      next: res => {
        this.customers = res.list
      },
      error: error => {
        console.log(error)
      }
    })
  }
  customerFilter(event: SelectFilterEvent) {
    this.subjectCustomerFilter.next(event.filter)
  }
  onSubmit() {
    if (this.sendForm.invalid) {
      this.sendForm.markAllAsTouched()
      return
    }
    this.loading = true
    const data: GiftCard = deepCopy(this.sendForm.value)
    this.programService.sendCode(data).subscribe({
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

import { Component } from '@angular/core';
import { Customer } from '../../shared/models/customer';
import { CustomerService } from '../../services/customer/customer.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginationParams } from '../../shared/models/pagination-params';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { ImportCustomersComponent } from '../import-customers/import-customers.component';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-customers',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: Customer[] = []
  total_records: number = 0
  rows: number = 0
  filter: PaginationParams = new PaginationParams()
  searchForm!: FormGroup
  ref!: DynamicDialogRef
  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.searchForm = this.fb.group({
      name: [null]
    })
    this.searchForm.valueChanges.pipe(debounceTime(1000)).subscribe((data) => {
      this.onSearch(data)
    })
  }
  ngOnInit() {
    this.loadCustomers()
  }
  onSearch(data: any) {
    this.filter = new PaginationParams(data.name, 1, 10)
    this.loadCustomers()
  }
  onPageChanged(event: any) {
    this.filter.page = event.first / event.rows + 1
    this.filter.limit = event.rows
    this.loadCustomers()
  }
  loadCustomers() {
    this.customerService.get(this.filter).subscribe({
      next: (res) => {
        this.customers = res.list
        this.total_records = res.total_records
        this.rows = res.page_size
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  showAddDialog() {
    this.ref = this.dialogService.open(AddCustomerComponent, {
      header: "Add Customer",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadCustomers()
    })
  }
  showImportDialog() {
    this.ref = this.dialogService.open(ImportCustomersComponent, {
      header: "Import Customers",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadCustomers()
    })
  }
  showEditDialog(customer: Customer) {
    this.ref = this.dialogService.open(EditCustomerComponent, {
      header: "Edit Customer",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: customer
    })
    this.ref.onClose.subscribe(() => {
      this.loadCustomers()
    })
  }
  delete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete this customer',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
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
        this.customerService.delete(id).subscribe({
          next: (res) => {
            if (res.status_code == 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.detail });
              this.loadCustomers()
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
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    })
  }
}

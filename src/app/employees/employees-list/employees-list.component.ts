import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { EmployeeService } from '../../services/employee/employee.service';
import { PagedResponse } from '../../shared/models/paged-response';
import { EmployeeBase } from '../../shared/models/employee-base';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ImportEmployeesComponent } from '../import-employees/import-employees.component';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { PaginationParams } from '../../shared/models/pagination-params';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-employees-list',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CommonModule,
    DynamicDialogModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent {
  employees: EmployeeBase[] = []
  employeeFilter: PaginationParams = new PaginationParams()
  loading: boolean = true
  ref!: DynamicDialogRef
  total_records: number = 0
  rows: number = 10
  searchForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.searchForm = this.fb.group({
      name: ['']
    })
    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
      this.onValueChanged(data)
    })
  }
  loadEmployees() {
    this.employeeService.get(this.employeeFilter).subscribe({
      next: (res: PagedResponse<EmployeeBase>) => {
        if (res.status_code == 200) {
          this.employees = res.list
          this.total_records = res.total_records
          this.rows = res.page_size
          this.loading = false
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  ngOnInit() {
    this.loadEmployees()
  }

  onValueChanged(data: any) {
    this.employeeFilter = new PaginationParams(data.name, 1, this.employeeFilter.limit)
    this.loadEmployees()
  }

  onPageChanged(event: any) {
    this.employeeFilter.page = event.first / event.rows + 1
    this.employeeFilter.limit = event.rows
    this.loadEmployees()
  }

  showAddDialog() {
    this.ref = this.dialogService.open(AddEmployeeComponent, {
      header: "Add Employee",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadEmployees()
    })
  }
  showImportDialog() {
    this.ref = this.dialogService.open(ImportEmployeesComponent, {
      header: "Import Employees",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadEmployees()
    })
  }
  showEditDialog(employee: any) {
    this.ref = this.dialogService.open(EditEmployeeComponent, {
      header: "Add Employee",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: { employee }
    })
    this.ref.onClose.subscribe(() => {
      this.loadEmployees()
    })
  }
  delete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete this employee',
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
        this.employeeService.delete(id).subscribe({
          next: (res) => {
            if (res.status_code == 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.detail });
              this.loadEmployees()
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

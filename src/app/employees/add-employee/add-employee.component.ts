import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { genders } from '../../shared/enums/gender';
import { contract_types } from '../../shared/enums/contract-type';
import { roles } from '../../shared/enums/role';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../shared/validators/email-validator.validator';
import { requiredCnss } from '../../shared/validators/required-cnss.validator';
import { cnssNumberValidator } from '../../shared/validators/cnss-number-validator.validator';
import { InputNumberModule } from 'primeng/inputnumber';
import { EmployeeBase } from '../../shared/models/employee-base';
import { EmployeeService } from '../../services/employee/employee.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { formatDate } from '@angular/common';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { handleForm } from '../../shared/utilities/handle-form';
@Component({
  selector: 'app-add-employee',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    SelectButtonModule,
    InputNumberModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
  loading: boolean = false
  gender!: Object[]
  contracts!: Object[]
  roles!: Object[]
  addForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.contracts = contract_types
    this.gender = genders
    this.roles = roles
    this.addForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, emailValidator]],
      number: ['', [Validators.required, Validators.min(1)]],
      phone_number: [''],
      cnss_number: ['', [cnssNumberValidator]],
      gender: ['', [Validators.required]],
      roles: ['', [Validators.required]],
      contract_type: ['', [Validators.required]],
      birth_date: [''],
      address: [''],

    }, { validators: [requiredCnss()] })
  }
  ngOnInit() { }
  onSubmit() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched()
      return
    }
    this.loading = true
    const employee: EmployeeBase = handleForm(deepCopy(this.addForm.value))
    if (employee.birth_date) {
      employee.birth_date = formatDate(new Date(employee.birth_date), "yyyy-MM-dd", "en-US")
    } else {
      employee.birth_date = undefined
    }
    this.employeeService.add(employee).subscribe({
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { cnssNumberValidator } from '../../shared/validators/cnss-number-validator.validator';
import { requiredCnss } from '../../shared/validators/required-cnss.validator';
import { emailValidator } from '../../shared/validators/email-validator.validator';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password-validator.validator';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { roles } from '../../shared/enums/role';
import { contract_types } from '../../shared/enums/contract-type';
import { genders } from '../../shared/enums/gender';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmployeeBase } from '../../shared/models/employee-base';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeEdit } from '../../shared/models/employee-edit';
import { MessageService } from 'primeng/api';
import { handleForm } from '../../shared/utilities/handle-form';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit-employee',
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    DatePickerModule,
    SelectButtonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent {
  employee!: EmployeeBase
  editForm: FormGroup
  loading: boolean = false
  roles = roles
  contracts = contract_types
  gender = genders
  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.employee = config.data.employee
    this.editForm = this.fb.group({
      first_name: [this.employee.first_name || null, [Validators.required]],
      last_name: [this.employee.last_name || null, [Validators.required]],
      email: [this.employee.email || null, [Validators.required, emailValidator]],
      number: [this.employee.number || null, [Validators.required, Validators.min(1)]],
      phone_number: [this.employee.phone_number || null],
      cnss_number: [this.employee.cnss_number || null, [cnssNumberValidator]],
      gender: [this.employee.gender || null, [Validators.required]],
      roles: [this.employee.roles || null, [Validators.required]],
      contract_type: [this.employee.contract_type || null, [Validators.required]],
      birth_date: [this.employee.birth_date ? new Date(this.employee.birth_date) : null],
      address: [this.employee.address || null],
      password: [''],
      confirm_password: ['']

    }, { validators: [requiredCnss(), confirmPasswordValidator()] })
  }
  onSubmit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched()
      return
    }
    this.loading = true
    const employee: EmployeeEdit = handleForm(deepCopy(this.editForm.value))
    if (employee.birth_date) employee.birth_date = formatDate(employee.birth_date, "yyyy-MM-dd", "en-US")
    else employee.birth_date = undefined
    this.employeeService.edit(employee, this.employee.id).subscribe({
      next: (res) => {
        if (res.status_code == 200) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          this.ref.close()
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: res.detail })
        }
      }
    })
  }
}

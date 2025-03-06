import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { emailValidator } from '../shared/validators/email-validator.validator';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
import { ForgetPassword } from '../shared/models/forget-password';
import { BaseOut } from '../shared/models/base-out';
import { deepCopy } from '../shared/utilities/deepCopy';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
@Component({
  selector: 'app-forget-password',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  forgetForm: FormGroup
  loading: boolean = false

  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]]
    })
  }
  onSubmit() {
    if (this.forgetForm.invalid) {
      this.forgetForm.markAllAsTouched()
      return
    }
    this.loading = true
    const form: ForgetPassword = deepCopy(this.forgetForm.value)
    this.authService.forgetPassword(form).subscribe({
      next: (res: BaseOut) => {
        this.loading = false
        if (res.status_code == 200) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          timer(2000).subscribe(() => {
            this.router.navigate(['/login'])
          })
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

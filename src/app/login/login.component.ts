import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { emailValidator } from '../shared/validators/email-validator.validator';
import { Login } from '../shared/models/login';
import { deepCopy } from '../shared/utilities/deepCopy';
import { AuthService } from '../services/auth/auth-service.service';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule } from '@angular/router';
import { LoginToken } from '../shared/models/login-token';
@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  loading: boolean = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    this.loading = true
    const form: Login = deepCopy(this.loginForm.value)
    this.authService.login(form).subscribe({
      next: (res: LoginToken) => {
        this.loading = false
        if (res.status_code == 200) {
          localStorage.setItem("token", res.access_token)
          this.router.navigate(['/dashboard'])
          this.messageService.add({ summary: "Success", severity: "success", detail: "Login successfuly" })
        } else {
          this.messageService.add({ summary: "Error", severity: "error", detail: res.detail })
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}

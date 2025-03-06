import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
import { deepCopy } from '../shared/utilities/deepCopy';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { confirmPasswordValidator } from '../shared/validators/confirm-password-validator.validator';
import { PasswordModule } from 'primeng/password';
import { VerificationData } from '../shared/models/verification-data';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup
  loading: boolean = false
  code: string = ""
  constructor(
    private fb: FormBuilder,
    private activeRouter: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, { validators: [confirmPasswordValidator()] })
  }
  ngOnInit() {
    this.code = this.activeRouter.snapshot.queryParamMap.get("code") as string
  }
  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched()
      return
    }
    this.loading = true
    const verificationData: VerificationData = deepCopy(this.resetForm.value)
    verificationData.code = this.code
    this.authService.resetPassword(verificationData).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 200) {
          this.messageService.add({ summary: "Success", severity: "success", detail: res.detail })
          timer(2000).subscribe(() => {
            this.router.navigate(["/login"])
          })
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

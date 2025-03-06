import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password-validator.validator';
import { PasswordModule } from 'primeng/password';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmAccount } from '../../shared/models/confirm-account';
import { AuthService } from '../../services/auth/auth-service.service';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
@Component({
  selector: 'app-confirm-account',
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css'
})
export class ConfirmAccountComponent {
  confirmForm: FormGroup
  loading: boolean = false
  confirmation_code!: string
  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.confirmForm = this.fb.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, { validators: [confirmPasswordValidator()] })
  }
  ngOnInit() {
    this.activateRoute.queryParams.subscribe((data) => {
      this.confirmation_code = data['code']
    })
  }
  onSubmit() {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched()
      return
    }
    this.loading = true
    const entry: ConfirmAccount = { ...this.confirmForm.value }
    entry.code = this.confirmation_code
    this.authService.confirmAccount(entry).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 200) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          timer(1000).subscribe(() => {
            this.router.navigate(['/login'])
          })
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: res.detail })
        }
      }
    })
  }
}

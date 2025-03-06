import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../shared/models/login';
import { LoginToken } from '../../shared/models/login-token';
import { baseUrl } from '../../shared/utilities/baseUrl';
import { ForgetPassword } from '../../shared/models/forget-password';
import { BaseOut } from '../../shared/models/base-out';
import { VerificationData } from '../../shared/models/verification-data';
import { ConfirmAccount } from '../../shared/models/confirm-account';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: Login) {
    const formData = new FormData()
    formData.append("username", credentials.email)
    formData.append("password", credentials.password)
    return this.http.post<LoginToken>(`${baseUrl}/auth/login`, formData)
  }
  forgetPassword(form: ForgetPassword) {
    return this.http.post<BaseOut>(`${baseUrl}/auth/forgotPassword`, form)
  }
  resetPassword(verificationData: VerificationData) {
    return this.http.patch<BaseOut>(`${baseUrl}/auth/resetPassword`, verificationData)
  }
  confirmAccount(entry: ConfirmAccount) {
    return this.http.patch<BaseOut>(`${baseUrl}/auth/confirmAccount`, entry)
  }
}

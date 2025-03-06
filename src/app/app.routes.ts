import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmAccountComponent } from './employees/confirm-account/confirm-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesListComponent } from './employees/employees-list/employees-list.component';

export const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "login", component: LoginComponent, title: "Login" },
    { path: "forgetPassword", component: ForgetPasswordComponent, title: "Forget password" },
    { path: "resetPassword", component: ResetPasswordComponent, title: "Reset password" },
    { path: "confirmAccount", component: ConfirmAccountComponent, title: "Confirm account" },
    {
        path: "",
        component: LayoutComponent,
        children: [
            { path: "dashboard", component: DashboardComponent, title: "Dashboard" },
            { path: "employees", component: EmployeesListComponent, title: "Employees" },
            { path: "stockDetails", component: StockDetailsComponent, title: "Stock" }
        ]

    }
];

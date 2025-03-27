import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-notfound',
    imports: [
        ButtonModule,
        RouterLink
    ],
    styles: [],
    templateUrl: './notfound.component.html',
    styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {
    goHome() { }
}

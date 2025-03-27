import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { PricelistsComponent } from "../pricelists/pricelists/pricelists.component";
import { ProgramsComponent } from "../programs/programs/programs.component";

@Component({
  selector: 'app-discount-details',
  imports: [
    TabsModule,
    PricelistsComponent,
    ProgramsComponent
  ],
  templateUrl: './discount-details.component.html',
  styleUrl: './discount-details.component.css'
})
export class DiscountDetailsComponent {

}

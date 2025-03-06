import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CategoriesComponent } from "../categories/categories/categories.component";
import { ProductsComponent } from "../products/products/products.component";

@Component({
  selector: 'app-stock-details',
  imports: [
    TabsModule,
    CategoriesComponent,
    ProductsComponent
  ],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css'
})
export class StockDetailsComponent {

}

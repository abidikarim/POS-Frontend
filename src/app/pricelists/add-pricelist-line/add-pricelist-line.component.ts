import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectFilterEvent, SelectModule } from 'primeng/select';
import { ProductOut } from '../../shared/models/product-out';
import { CategoryOut } from '../../shared/models/category-out';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { CategoryService } from '../../services/category/category.service';
import { ProductService } from '../../services/product/product.service';
import { ProductFilter } from '../../shared/models/product-filter';
import { PaginationParams } from '../../shared/models/pagination-params';
import { debounceTime, Subject } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PricelistLineBase } from '../../shared/models/pricelist-line-base';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { PricelistService } from '../../services/pricelist/pricelist.service';
import { MessageService } from 'primeng/api';
import { handleForm } from '../../shared/utilities/handle-form';
import { formatDate } from '@angular/common';
import { datesValidator } from '../../shared/validators/dates-validator.validator';

@Component({
  selector: 'app-add-pricelist-line',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule
  ],
  templateUrl: './add-pricelist-line.component.html',
  styleUrl: './add-pricelist-line.component.css'
})
export class AddPricelistLineComponent {
  addForm!: FormGroup
  loading: boolean = false
  categories!: CategoryOut[]
  prodcuts!: ProductOut[]
  pricelist_id!: number
  productFilter: ProductFilter = new ProductFilter()
  categoryFilter: PaginationParams = new PaginationParams()
  private categoryFilterSubject = new Subject<string>();
  private productFilterSubject = new Subject<string>();
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private config: DynamicDialogConfig,
    private pricelistService: PricelistService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.addForm = this.fb.group({
      new_price: [null, [Validators.required, Validators.min(1)]],
      min_quantity: [null, [Validators.required, Validators.min(1)]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      product_id: [null],
      pricelist_id: [this.config.data]
    }, { validators: [datesValidator()] })
  }
  ngOnInit() {
    this.loadCategories()
    this.loadProducts()
    this.categoryFilterSubject.pipe(debounceTime(1000)).subscribe((data) => {
      this.categoryFilter.name = data
      this.loadCategories()
    })
    this.productFilterSubject.pipe(debounceTime(1000)).subscribe((data) => {
      this.productFilter.name = data
      this.loadProducts()
    })
  }
  loadProducts() {
    this.productService.get(this.productFilter).subscribe({
      next: (res) => {
        this.prodcuts = res.list
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  loadCategories() {
    this.categoryService.get(this.categoryFilter).subscribe({
      next: (res) => {
        this.categories = res.list
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  onFilterCategory(event: SelectFilterEvent) {
    this.categoryFilterSubject.next(event.filter)
  }
  onFilterProduct(event: SelectFilterEvent) {
    this.productFilterSubject.next(event.filter)
  }
  onChangeCategory(event: SelectChangeEvent) {
    this.productFilter.category = event.value
    this.loadProducts()
  }
  onSubmit() {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched()
      return
    }
    this.loading = true
    const line: PricelistLineBase = deepCopy(handleForm(this.addForm.value))
    line.start_date = formatDate(line.start_date, "yyyy-MM-dd", "en-US")
    line.end_date = formatDate(line.end_date, "yyyy-MM-dd", "en-US")
    this.pricelistService.addPricelistLine(line).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 201) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          this.ref.close()
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

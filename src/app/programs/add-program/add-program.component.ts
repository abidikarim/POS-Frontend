import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { SelectChangeEvent, SelectFilterEvent, SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgramType, programTypes } from '../../shared/enums/prgram-type';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductFilter } from '../../shared/models/product-filter';
import { ProductOut } from '../../shared/models/product-out';
import { ProductService } from '../../services/product/product.service';
import { debounceTime, last, Subject } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { datesValidator } from '../../shared/validators/dates-validator.validator';
import { ProgramBase } from '../../shared/models/program-base';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { handleForm } from '../../shared/utilities/handle-form';
import { ProgramService } from '../../services/program/program.service';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-program',
  imports: [
    ReactiveFormsModule,
    TextareaModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.css'
})
export class AddProgramComponent {
  programTypes = programTypes
  addProgram!: FormGroup
  loading: boolean = false
  programType!: ProgramType
  filter: ProductFilter = new ProductFilter()
  productsToBuy!: ProductOut[]
  productsToGet!: ProductOut[]
  productToBuyFilterSubject = new Subject<string>();
  productToGetFilterSubject = new Subject<string>();
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private programService: ProgramService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.addProgram = this.fb.group({
      name: [null, [Validators.required]],
      description: [null],
      program_type: [null, [Validators.required]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      discount: [null],
      product_to_buy_id: [null],
      product_to_get_id: [null],
      items_count: [null]
    }, { validators: [datesValidator()] })
  }
  ngOnInit() {
    this.productToBuyFilterSubject.pipe(debounceTime(1000)).subscribe(data => {
      this.filter.name = data
      this.loadProducts('buy')
      const productToGetId = this.addProgram.get("product_to_get_id")?.value
      if (productToGetId) {
        this.productsToBuy = this.productsToBuy.filter((product) => {
          return product.id != productToGetId
        })
      }
    })
    this.productToGetFilterSubject.pipe(debounceTime(1000)).subscribe(data => {
      this.filter.name = data
      this.loadProducts('get')
      const productToBuyId = this.addProgram.get("product_to_buy_id")?.value
      if (productToBuyId) {
        this.productsToGet = this.productsToGet.filter((product) => {
          return product.id != productToBuyId
        })
      }
    })
  }
  loadProducts(type: 'buy' | 'get' | 'both') {
    this.productService.get(this.filter).subscribe({
      next: res => {
        if (type == 'buy') {
          this.productsToBuy = res.list
          return
        }
        if (type == "get") {
          this.productsToGet = res.list
          return
        }
        this.productsToBuy = res.list
        this.productsToGet = res.list
      },
      error: error => {
        console.log(error)
      }
    })
  }
  changeProgramType(event: SelectChangeEvent) {
    this.programType = event.value
    if (this.programType == ProgramType.BuyXgetY) {
      this.loadProducts('both')
      this.addProgram.get("discount")?.clearValidators();
      this.addProgram.get("items_count")?.clearValidators();
      this.addProgram.get("product_to_buy_id")?.setValidators([Validators.required])
      this.addProgram.get("product_to_get_id")?.setValidators([Validators.required])
    } else {
      this.addProgram.get("product_to_buy_id")?.clearValidators();
      this.addProgram.get("product_to_get_id")?.clearValidators();
      this.addProgram.get("discount")?.setValidators([Validators.required, Validators.min(1)])
      this.addProgram.get("items_count")?.setValidators([Validators.required, Validators.min(0)])
    }
    this.addProgram.get("discount")?.updateValueAndValidity();
    this.addProgram.get("items_count")?.updateValueAndValidity();
    this.addProgram.get("product_to_buy_id")?.updateValueAndValidity();
    this.addProgram.get("product_to_get_id")?.updateValueAndValidity();
  }
  productFilter(type: 'buy' | 'get' | 'both', event: SelectFilterEvent) {
    if (type == 'buy') {
      this.productToBuyFilterSubject.next(event.filter)
    } else {
      this.productToGetFilterSubject.next(event.filter)
    }
  }
  onSelectProduct(event: SelectChangeEvent, type: "buy" | "get") {
    if (type == "buy") {
      this.productsToGet = this.productsToGet.filter((product) => {
        return product.id != event.value
      })
    } else {
      this.productsToBuy = this.productsToBuy.filter((product) => {
        return product.id != event.value
      })
    }
  }
  onSubmit() {
    if (this.addProgram.invalid) {
      this.addProgram.markAllAsTouched()
      return
    }
    this.loading = true
    const program: ProgramBase = deepCopy(handleForm(this.addProgram.value))
    program.start_date = formatDate(program.start_date, "yyyy-MM-dd", "en-US")
    program.end_date = formatDate(program.end_date, "yyyy-MM-dd", "en-US")
    this.programService.add(program).subscribe({
      next: res => {
        this.loading = false
        if (res.status_code == 201) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          this.ref.close()
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: res.detail })
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }
}

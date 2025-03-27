import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { OrderOut } from '../../shared/models/order-out';
import { TableModule } from 'primeng/table';
import { OrderService } from '../../services/order/order.service';
import { OrderFilter } from '../../shared/models/order-filter';
import { DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-orders',
  imports: [
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
    TableModule,
    DatePipe,
    InputTextModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  searchForm!: FormGroup
  orders: OrderOut[] = []
  rows: number = 5
  total_records: number = 0
  loading: boolean = true
  filter: OrderFilter = new OrderFilter()
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.searchForm = this.fb.group({
      order_ref: [null],
      session_id: [null],
      number: [null],
      employee_name: [null]
    })
  }

  ngOnInit() {
    this.loadOrders()
  }
  loadOrders() {
    this.orderService.get(this.filter).subscribe({
      next: (res) => {
        this.loading = false
        this.orders = res.list
        this.rows = res.page_size
        this.total_records = res.total_records
      },
      error: error => {
        console.log(error)
      }
    })
  }
  onPageChanged(event: any) { }
}

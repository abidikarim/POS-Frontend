import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PriceList } from '../../shared/models/pricelist';
import { TableModule } from 'primeng/table';
import { PricelistService } from '../../services/pricelist/pricelist.service';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddPricelistComponent } from '../add-pricelist/add-pricelist.component';
import { AddPricelistLineComponent } from '../add-pricelist-line/add-pricelist-line.component';
import { EditPricelistComponent } from '../edit-pricelist/edit-pricelist.component';
import { CommonModule, DatePipe } from '@angular/common';
import { PricelistLine } from '../../shared/models/pricelist-line';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { deepCopy } from '../../shared/utilities/deepCopy';
import { PricelistLineBase } from '../../shared/models/pricelist-line-base';
import { ConfirmationService, MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-pricelists',
  imports: [
    FormsModule,
    CommonModule,
    AccordionModule,
    TableModule,
    ButtonModule,
    DatePipe,
    InputNumberModule,
    DatePickerModule,
    InputTextModule
  ],
  templateUrl: './pricelists.component.html',
  styleUrl: './pricelists.component.css'
})
export class PricelistsComponent {
  pricelists: PriceList[] = []
  currentLine!: PricelistLine
  ref!: DynamicDialogRef
  constructor(
    private pricelistService: PricelistService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }
  ngOnInit() {
    this.loadPricelists()
  }
  loadPricelists() {
    this.pricelistService.get().subscribe({
      next: (res) => {
        this.pricelists = res
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  addDialog() {
    this.ref = this.dialogService.open(AddPricelistComponent, {
      header: "Add Pricelist",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadPricelists()
    })
  }
  addPricelistLine(pricelist_id: number) {
    this.ref = this.dialogService.open(AddPricelistLineComponent, {
      header: "Add Pricelist Line",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: pricelist_id
    })
    this.ref.onClose.subscribe(() => {
      this.loadPricelists()
    })
  }
  editPricelist(pricelist: PriceList) {
    this.ref = this.dialogService.open(EditPricelistComponent, {
      header: "Edit Pricelist Line",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: pricelist
    })
    this.ref.onClose.subscribe(() => {
      this.loadPricelists()
    })
  }
  editMode(line: PricelistLine) {
    line.isEdit = true
    this.currentLine = deepCopy(line)
    line.start_date = line.start_date ? new Date(line.start_date) : "";
    line.end_date = line.end_date ? new Date(line.end_date) : "";
  }
  onCancel(line: PricelistLine) {
    Object.assign(line, this.currentLine)
    line.isEdit = false
  }
  onSaveChange(line: PricelistLine) {
    const line_data: PricelistLineBase = {
      new_price: line.new_price,
      min_quantity: line.min_quantity,
      start_date: formatDate(line.start_date, "yyyy-MM-dd", "en-US"),
      end_date: formatDate(line.end_date, "yyyy-MM-dd", "en-US"),
      pricelist_id: line.pricelist_id,
      product_id: line.product_id
    }
    this.pricelistService.editPricelistLine(line_data, line.id).subscribe({
      next: res => {
        if (res.status_code == 200) {
          this.messageService.add({ severity: "success", summary: "Success", detail: res.detail })
          line.isEdit = false
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: res.detail })
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }
  isSaveDisabled(line: any): boolean {
    return (
      !line.new_price || line.new_price <= 0 ||
      !line.min_quantity || line.min_quantity <= 0 ||
      !line.start_date || !line.end_date ||
      line.start_date >= line.end_date
    );
  }
  deletePricelistLine(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure want to delete this pricelist line?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.pricelistService.deletePricelistLine(id).subscribe({
          next: res => {
            if (res.status_code == 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: res.detail });
              this.loadPricelists()
            } else {

            }
          }
        })
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
}

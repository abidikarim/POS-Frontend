import { Component } from '@angular/core';
import { Program } from '../../shared/models/program';
import { ProgramService } from '../../services/program/program.service';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddProgramComponent } from '../add-program/add-program.component';
import { SendCodeComponent } from '../send-code/send-code.component';
import { PrintCodeComponent } from '../print-code/print-code.component';

@Component({
  selector: 'app-programs',
  imports: [
    CommonModule,
    AccordionModule,
    TableModule,
    ButtonModule
  ],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css'
})
export class ProgramsComponent {
  programs!: Program[]
  ref!: DynamicDialogRef

  constructor(
    private programService: ProgramService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.loadPrograms()
  }
  loadPrograms() {
    this.programService.get().subscribe({
      next: res => {
        this.programs = res
      },
      error: error => {
        console.log(error)
      }
    })
  }
  showAddDialog() {
    this.ref = this.dialogService.open(AddProgramComponent, {
      header: "Add Program",
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
    })
    this.ref.onClose.subscribe(() => {
      this.loadPrograms()
    })
  }
  onSendCode(code_id: number) {
    this.ref = this.dialogService.open(SendCodeComponent, {
      header: "Send Code",
      contentStyle: { overflow: 'auto' },
      width: "400px",
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: code_id
    })
  }
  onPrintCode(item_id: number) {
    this.programService.printCode(item_id).subscribe({
      next: (res: Blob) => {
        this.openPdfDialog(res)
      },
      error: error => {
        console.log(error)
      }
    })
  }
  openPdfDialog(pdfBlob: Blob) {
    this.ref = this.dialogService.open(PrintCodeComponent, {
      header: "Print Code",
      contentStyle: { overflow: 'auto' },
      width: "50%",
      height: "70%",
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      data: pdfBlob
    })
  }
}

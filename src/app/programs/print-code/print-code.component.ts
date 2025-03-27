import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // Import Ng2PdfViewerModule

@Component({
  selector: 'app-print-code',
  imports: [
    ButtonModule,
    PdfViewerModule
  ],
  templateUrl: './print-code.component.html',
  styleUrl: './print-code.component.css'
})
export class PrintCodeComponent {
  pdfBlob!: Blob;
  pdfSrc: any;
  constructor(private config: DynamicDialogConfig) {
    this.pdfBlob = this.config.data
    this.pdfSrc = URL.createObjectURL(this.pdfBlob)
  }
  printPDF() {
    const printWindow = window.open(this.pdfSrc);
    printWindow?.print();
  }
  downloadPDF() {
    const link = document.createElement('a');
    link.href = this.pdfSrc;
    link.download = 'giftcard.pdf';
    link.click();
  }
}

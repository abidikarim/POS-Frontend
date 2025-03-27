import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Session } from '../../shared/models/session';
import { SessionService } from '../../services/session/session.service';
import { PaginationParams } from '../../shared/models/pagination-params';
import { debounceTime } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionComponent } from '../session/session.component';

@Component({
  selector: 'app-sessions',
  imports: [
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    DatePipe,
    TagModule
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {
  sessions: Session[] = []
  total_records: number = 0
  rows: number = 5
  searchForm!: FormGroup
  loading: boolean = true
  filter: PaginationParams = new PaginationParams()
  selectedSession!: Session
  ref!: DynamicDialogRef
  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private dialogService: DialogService
  ) {
    this.searchForm = this.fb.group({
      name: [null]
    })
    this.searchForm.valueChanges.pipe(debounceTime(1000)).subscribe((data) => {
      this.onValueChanged(data)
    })
  }
  ngOnInit() {
    this.loadSessions()
  }
  onValueChanged(data: any) {
    this.filter = new PaginationParams(data.name, 1, 10)
    this.loadSessions()
  }
  loadSessions() {
    this.sessionService.get(this.filter).subscribe({
      next: (res) => {
        this.loading = false
        if (res.status_code == 200) {
          this.sessions = res.list
          this.total_records = res.total_records
          this.rows = this.filter.limit
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }
  onPageChanged(event: any) {
    this.filter.page = event.first / event.rows + 1
    this.filter.limit = event.rows
    this.loadSessions()
  }
  openSession(session: Session) {
    this.ref = this.dialogService.open(SessionComponent, {
      showHeader: false,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      closable: true,
      width: "100%",
      height: "100%",
      data: session,
    })
  }
}

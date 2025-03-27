import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCodeComponent } from './print-code.component';

describe('PrintCodeComponent', () => {
  let component: PrintCodeComponent;
  let fixture: ComponentFixture<PrintCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

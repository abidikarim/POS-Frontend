import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPricelistLineComponent } from './add-pricelist-line.component';

describe('AddPricelistLineComponent', () => {
  let component: AddPricelistLineComponent;
  let fixture: ComponentFixture<AddPricelistLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPricelistLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPricelistLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

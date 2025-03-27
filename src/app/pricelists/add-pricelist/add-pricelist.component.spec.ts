import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPricelistComponent } from './add-pricelist.component';

describe('AddPricelistComponent', () => {
  let component: AddPricelistComponent;
  let fixture: ComponentFixture<AddPricelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPricelistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPricelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressFormComponent } from './shipping-address-form.component';

describe('ShippingAddressFormComponent', () => {
  let component: ShippingAddressFormComponent;
  let fixture: ComponentFixture<ShippingAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAddressFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

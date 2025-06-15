import { Component, inject } from '@angular/core';
import { ShippingAddress } from '../../../models/shippingAddress';
import { ShippingAddressService } from '../../../service/shippingAddressService';
import { DataService } from '../../../service/dataService';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user';

@Component({
  selector: 'app-shipping-address-form',
  imports: [ReactiveFormsModule],
  templateUrl: './shipping-address-form.component.html',
  styleUrl: './shipping-address-form.component.css'
})
export class ShippingAddressFormComponent {
  private _shippingAddressService = inject(ShippingAddressService);
  private _dataService = inject(DataService);
  private _router = inject(Router);
  fb = inject(FormBuilder);

  currentUser!: User;
  savedAddresses: ShippingAddress[] = [];
  selectedAddressId: number | null = null;
  showNewAddressForm = false;

  addressForm: FormGroup = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    postalCode: ['', Validators.required]
  });

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadAddresses();
      }
    });
  }

  loadAddresses() {
    this._shippingAddressService.getAddressesByUSerId(this.currentUser.userId).subscribe({
      next: (addresses) => this.savedAddresses = addresses,
      error: (err) => console.error("Errore nel caricamento indirizzi", err)
    });
  }

  toggleNewAddressForm() {
    this.showNewAddressForm = !this.showNewAddressForm;
    this.selectedAddressId = null; // disattiva selezione
  }

  selectAddress(id: number) {
    this.selectedAddressId = id;
    this.showNewAddressForm = false;
  }

  continue() {
    if (this.selectedAddressId != null) {
      this._router.navigate(['/payment-form'], {
        queryParams: { addressId: this.selectedAddressId }
      });
    } else if (this.showNewAddressForm && this.addressForm.valid) {
      const newAddress: ShippingAddress = {
        ...this.addressForm.value,
        userId: this.currentUser.userId
      };
      this._shippingAddressService.addAddress(newAddress).subscribe({
        next: (created) => {
          this._router.navigate(['/payment-form'], {
            queryParams: { addressId: created.shippingId }
          });
        },
        error: (err) => alert("Errore nel salvataggio dell’indirizzo: " + err)
      });
    } else {
      alert("Seleziona o inserisci un indirizzo valido!");
    }
  }
}

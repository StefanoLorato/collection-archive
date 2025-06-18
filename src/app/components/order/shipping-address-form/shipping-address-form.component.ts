import { Component, inject } from '@angular/core';
import { DataService } from '../../../service/dataService';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { ShippingAddressService } from '../../../service/shippingAddressService';
import { ShippingAddress } from '../../../models/shippingAddress';
import { Collection } from '../../../models/collection';
import { Item } from '../../../models/item';

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
  private _route = inject(ActivatedRoute);
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
    this.selectedAddressId = null;
  }

  selectAddress(id: number) {
    this.selectedAddressId = id;
    this.showNewAddressForm = false;
  }

  continue() {
    const itemId = this._route.snapshot.queryParamMap.get('itemId');
    const collectionId = this._route.snapshot.queryParamMap.get('collectionId');
    const queryParams: any = {};
    if (itemId) queryParams.itemId = itemId;
    if (collectionId) queryParams.collectionId = collectionId;


    if (this.selectedAddressId != null) {
      this._router.navigate(['/payment-form'], {
        queryParams: { addressId: this.selectedAddressId, itemId: itemId, collectionId: collectionId }
      });
    } else if (this.showNewAddressForm && this.addressForm.valid) {
      const newAddress: ShippingAddress = {
        ...this.addressForm.value,
        userId: this.currentUser.userId
      };
      this._shippingAddressService.addAddress(newAddress).subscribe({
        next: (created) => {
          this._router.navigate(['/payment-form'], {
            queryParams: { addressId: created.shippingId, itemId: itemId, collectionId: collectionId }
          });
        },
        error: (err) => alert("Errore nel salvataggio dell’indirizzo: " + err)
      });
    } else {
      alert("Seleziona o inserisci un indirizzo valido!");
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  private _authService = inject(AuthService);
  private _router = inject(Router);
  formBuilder = inject(FormBuilder);
  registerForm!: FormGroup;

  constructor() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const name = this.registerForm.get('name')?.value;
    const lastname = this.registerForm.get('lastname')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const country = this.registerForm.get('country')?.value;

    this._authService.register(name, lastname, email, password, country).subscribe({
      next: () => {
        alert("Register with success!");
        this._router.navigate(['/login']);
      },
      error: err => alert("Errore during save user")
    });
  }
}

import { Component, inject } from '@angular/core';
import { AuthService } from '../../../service/authService';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  private _authService = inject(AuthService);
  private _router = inject(Router);
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

onSubmit() {
  if (this.loginForm.invalid) return;

  const email = this.loginForm.get('email')?.value;
  const password = this.loginForm.get('password')?.value;

  this._authService.login({ email, password }).subscribe({
    next: (res) => {
      
      alert("Login with success!");
      this._router.navigate(['/home']);    
    },
    error: err => alert("Errore durante login")
  });
}


}

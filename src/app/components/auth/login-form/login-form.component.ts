import { Component, inject } from '@angular/core';
import { AuthService } from '../../../service/authService';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../service/dataService';
import { UserService } from '../../../service/userService';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _dataService = inject(DataService);
  private _userService = inject(UserService);
  user : User | null = null;
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;
  show: boolean = false;
  password: string = '';

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    console.log(this.loginForm.value);
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this._authService.login({ email, password }).subscribe({
      next: (res) => {
        this.getUserByEmail(email);
        alert("Login with success!");
        this._router.navigate(['/dashboard']);
      },
      error: err => alert("Errore durante login" + err)
    });
  }

  getUserByEmail(email: string) {
    return this._userService.getUserByEmail(email).subscribe({
      next:  (user) => {
        this.user = user;
        this._dataService.selectedUser(user);
        localStorage.setItem('loggedUser', JSON.stringify(user));
      },
      error: err => alert("Errore durante login" + err)
    })
  }

  toggle(): void {
    this.show = !this.show;
  }

}

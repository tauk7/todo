import { AuthService } from '../../core/api/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatInputModule } from '@angular/material/input';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { TextInputComponent } from '../../core/components/text-input/text-input.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, TextInputComponent, MatError],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]) as FormControl,
    password: new FormControl('', [Validators.required]),
  });
  emailControl = this.loginForm.get('email') as FormControl;
  passwordControl = this.loginForm.get('password') as FormControl;

  constructor(
    private formBuilder:  FormBuilder,
    private router: Router,
    private authService: AuthService
    ) { }

  async onSubmit() {
    if (this.loginForm.valid) {
      const result: any = await this.authService.auth(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value);
      console.log(result, result.errors);
      if(result?.errors) {
        this.loginForm.setErrors({ 'invalid': true });
        return;
      }

      localStorage.setItem('user', JSON.stringify(result.data.auth))
      this.router.navigate(['/todo']);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

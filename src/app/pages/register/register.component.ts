
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/api/auth/auth.service';
import { Router } from '@angular/router';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { TextInputComponent } from '../../core/components/text-input/text-input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, TextInputComponent, MatError],
  standalone: true,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validator: [this.checkPasswords] });
  nameControl: FormControl = this.registerForm.get('name') as FormControl;
  emailControl: FormControl = this.registerForm.get('email') as FormControl;
  passwordControl: FormControl = this.registerForm.get('password') as FormControl;
  confirmPasswordControl: FormControl = this.registerForm.get('confirmPassword') as FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

    allFieldsFill() {
      console.log(this.registerForm.get('email'))
      const { name, email, password, confirmPassword } = this.registerForm.value;
      return !name || !email || !password || !confirmPassword;
    }

    checkPasswords(group: FormGroup) {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      console.log('pass', pass, pass === confirmPass ? null : { dontMatch: true });

      return pass === confirmPass ? null : { dontMatch: true }
    }

  async onSubmit() {
    if(this.allFieldsFill()) this.registerForm.setErrors({ allFields: true });
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;

      const existingUser: any = await this.authService.checkEmailExists(email);

      if (existingUser.data?.user) {
        this.registerForm.get('email')?.setErrors({ 'exists': true });
        return;
      }

      const newUser: any = await this.authService.createUser(name, email, password);
      if(newUser?.errors) {
        this.registerForm.setErrors({ 'invalid': true });
        return;
      }

      localStorage.setItem('user', JSON.stringify(newUser.data.createUser));
      this.router.navigate(['/todo']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

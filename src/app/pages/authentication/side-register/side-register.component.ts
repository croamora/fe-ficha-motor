import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUser } from 'src/app/models/clientUser-model';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './side-register.component.html',
  styleUrl: './side-register.component.scss'
})
export class AppSideRegisterComponent {

  hidePassword1 = true;
  hidePassword2 = true;
  
  form = new FormGroup(
    {
      uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService

  ) {}

  get f() {
    return this.form.controls;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.form.valid) {
      const newUser: ClientUser = {
        name: this.form.value.uname,
        password: this.form.value.password,
        email: this.form.value.email,
        phone: Number(this.form.value.phone),
      };
      
      this.spinner.show();
      this.authService.saveClientUser(newUser).subscribe({
        next: (data) => {
          this.spinner.hide();
          this.router.navigate(['/authentication/login']);
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error al guardar el campeonato:', err);
        }
      });
    }
  }

  togglePassword1Visibility(): void {
    this.hidePassword1 = !this.hidePassword1;
  }

  togglePassword2Visibility(): void {
    this.hidePassword2 = !this.hidePassword2;
  }
}

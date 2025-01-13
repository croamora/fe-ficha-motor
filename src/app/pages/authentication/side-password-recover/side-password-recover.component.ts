import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { TallerService } from 'src/app/services/taller.service';

@Component({
  selector: 'app-side-password-recover',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxSpinnerModule,
    CommonModule
  ],
  templateUrl: './side-password-recover.component.html',
  styleUrl: './side-password-recover.component.scss'
})
export class SidePasswordRecoverComponent implements OnInit {

  codigo: string | null = null;
  hidePassword1 = true;
  hidePassword2 = true;
  user: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }


  ngOnInit(): void {
    this.spinner.show();
    this.codigo = this.route.snapshot.queryParamMap.get('codigo');
    this.authService.getUserbyCode(this.codigo ?? '').subscribe({
      next: (data) => {
        this.user = data;
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err)
        this.snackBar.open(err.error.msg, 'Cerrar', { duration: 3000 });
        this.spinner.hide();
      },
    });
    
  }


  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {

    if (this.form.valid) {
      this.spinner.show();
      const { password } = this.form.value;
      this.authService.changePassword(this.codigo ?? '', password ?? '').subscribe({
        next: (data) => {
          this.snackBar.open("Se ha cambiado la contraseña exitosamente", 'Cerrar', { duration: 3000 });
          this.spinner.hide();
          this.router.navigate(['/authentication/login']);
        },
        error: (err) => {
          console.log(err)
          this.snackBar.open(err.error.msg, 'Cerrar', { duration: 3000 });
          this.spinner.hide();
        },
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

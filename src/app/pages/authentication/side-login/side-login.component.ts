import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-login',
  standalone: true,
  encapsulation: ViewEncapsulation.None, 
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgxSpinnerModule
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {

  hidePassword = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.form = new FormGroup({
      uname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required]),
    });
  
  }

  submit() {

    if (this.form.valid) {
      const { uname, password } = this.form.value;
      this.spinner.show();
      this.authService.login(uname ?? '', password ?? '').subscribe({
        next: (response) => {
          this.spinner.hide();
          // Guardar el token recibido del backend
          this.authService.saveToken(response.token);
           // Redirigir según el perfil
          this.redirectBasedOnProfile();
        },
        error: (err) => {
          this.spinner.hide();
          this.snackBar.open('Credenciales Invalidas.', 'Cerrar', { duration: 3000 });
          console.error('credenciales invalidas:', err);
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }


  private redirectBasedOnProfile() {
    
    switch (this.authService.getProfileFromToken()) {
      case 1:
        this.router.navigate(['/admin']);
        break;
      case 2:
        this.router.navigate(['/client']);
        break;
      case 3:
        this.router.navigate(['/store']);
        break;
      default:
        this.router.navigate(['/descubrir']);
        break;
    }
  }

}

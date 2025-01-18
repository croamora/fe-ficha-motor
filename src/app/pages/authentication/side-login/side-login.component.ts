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
import { TallerService } from 'src/app/services/taller.service';
import { StorageService } from 'src/app/services/storage.service';

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
    private tallerService: TallerService,
    private storageService: StorageService,
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
          this.authService.saveToken(response.token);
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
        this.tallerService.getTalleresByIdUser().subscribe({
          next: (data) => {
              this.storageService.saveStores(data);
              this.storageService.saveSelectedStore(data[0]);
              this.router.navigate(['/store']);
          },
          error: (err) => {
            console.error('Error al cargar los talleres:', err);
          },
        });
        
        break;
      default:
        this.router.navigate(['/locales']);
        break;
    }
  }

}

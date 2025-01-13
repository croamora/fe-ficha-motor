import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-password-recover-request',
  standalone: true,
  imports: [
    RouterModule, 
    MaterialModule, 
    FormsModule, 
    ReactiveFormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './side-password-recover-request.component.html',
  styleUrl: './side-password-recover-request.component.scss'
})
export class SidePasswordRecoverRequestComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
  ) { }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get f() {
    return this.form.controls;
  }


  ngOnInit(): void {
    this.spinner.hide();
  }

  submit() {
    if (this.form.valid) {
      const { email } = this.form.value;
      this.spinner.show();
      this.authService.recoveryRequest(email ?? '').subscribe({
        next: (response) => {
          this.spinner.hide();
          Swal.fire({
            icon: 'info',
            title: "Hemos Recibido su solicitud.",
            text: "Le enviaremos un mail con las instrucciones para recuperar su contraseña",
            confirmButtonText: "OK",
            showCancelButton: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/authentication/login']);
            } 
          });         
        },
        error: (err) => {
          this.spinner.hide();
          this.snackBar.open('Error al solicitar la recuperación.', 'Cerrar', { duration: 3000 });
          console.error('Error al solicitar la recuperación:', err);
        },
      });
      
    }
  }

}

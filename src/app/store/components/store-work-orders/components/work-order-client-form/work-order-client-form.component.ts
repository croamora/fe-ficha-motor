import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/data.service';
import { MarcaService } from 'src/app/services/marca.service';
import { UserService } from 'src/app/services/user.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-work-order-client-form',
  standalone: true,
  imports: [    
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatButtonModule,
    MatTooltipModule, 
    MatCardModule, 
    MatInputModule, 
    MatCheckboxModule,
    TablerIconsModule,
    NgxSpinnerModule,
    MatPaginator,
    MatAutocompleteModule],
  templateUrl: './work-order-client-form.component.html',
  styleUrl: './work-order-client-form.component.scss'
})
export class WorkOrderClientFormComponent implements OnInit {

  @Input() client!: any;
  @Output() clientChange = new EventEmitter<any>();
  
  clientForm!: FormGroup;
  clientExists: boolean = true;
  showContact: boolean = false;

  constructor(
    private router : Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) {}


  ngOnInit(): void {

      this.loadClient(this.client);

  }


  get f() {
    return this.clientForm.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client']) {
      this.loadClient(this.client);
    }
  }

  checkCliente(): void {
    const email = this.clientForm.get('email')?.value;
    if(email && this.clientForm.get('email')?.valid){
      this.spinner.show();
      this.userService.getByEmail(email).subscribe({
        next: (data) => {
          this.clientExists = false; 
          this.spinner.hide();
          this.loadClient(data);
        },
        error: (err) => { 
          this.spinner.hide();
          console.error(err)
        },
      });
    }
  }

  loadClient(data : any) {     
    
    if(this.client.id){
      if (data.id) {      
        this.clientExists = false; 
        this.client = data;
        if(this.showContact){
          this.clientForm = this.fb.group({
            uname: new FormControl(this.client?.name, [Validators.required]),
            phone: new FormControl(this.client?.phone, [
              Validators.required,
              Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
            ]),
            email: new FormControl(this.client?.email, 
              [Validators.required, Validators.email]),
            contactuname: new FormControl('', [Validators.required]),
            contactphone: new FormControl('', [
              Validators.required,
              Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
            ]),
            contactemail: new FormControl('', [Validators.required, Validators.email]),
            });
        } else {
          this.clientForm = this.fb.group({
            uname: new FormControl(this.client?.name, [Validators.required]),
            phone: new FormControl(this.client?.phone, [
              Validators.required,
              Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
            ]),
            email: new FormControl(this.client?.email, 
              [Validators.required, Validators.email]),
            contactuname: new FormControl(''),
            contactphone: new FormControl('', [
              Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
            ]),
            contactemail: new FormControl(''),
            });
        }
       
      }
      this.clientForm.get('email')?.disable({ emitEvent: false });
    } else {
      this.clientForm = new FormGroup(
        {
          uname: new FormControl('', [Validators.required]),
          phone: new FormControl('', [
            Validators.required,
            Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
          ]),
          email: new FormControl('', [Validators.required, Validators.email]),
          contactuname: new FormControl(''),
          contactphone: new FormControl('', [
            Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
          ]),
          contactemail: new FormControl(''),
        }
      );
    }
    this.cdr.detectChanges();
      
  }

  toggleShowContact(isChecked: boolean){
    this.showContact = isChecked;
    this.loadClient(this.client)
  }

  changeCliente(): void {
    
  }

  guardar(): void {
  }




}



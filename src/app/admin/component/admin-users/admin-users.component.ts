import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    DragDropModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    TablerIconsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatTabsModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {


  displayedColumns: string[] = ['name', 'usuario', 'email', 'telefono'];
  usuarios: MatTableDataSource<UserModel>;
  palabraClave: string = '';
  pageIndex: number;
  length: number;

  displayedColumnsCliente: string[] = ['name', 'usuario', 'email', 'telefono'];
  clientes: MatTableDataSource<UserModel>;
  palabraClaveCliente: string = '';
  pageIndexCliente: number;
  lengthCliente: number;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}


  ngOnInit(): void {
    this.callDataCliente();
    this.callDataTaller();
  }

  public getServerDataTaller(event:PageEvent){
    this.callDataTaller(event);
  }

  public getServerDataCliente(event:PageEvent){
    this.callDataCliente(event);
  }

  public callDataCliente(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 12;
    this.spinner.show();
    this.userService.getUsuariosClientes(pageNum, pageSize, this.palabraClaveCliente).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndexCliente = response.pageNum - 1;
        this.lengthCliente = response.total;
        this.clientes = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los Modelos:', err);
      },
    });
  }

  public callDataTaller(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 12;
    this.spinner.show();
    this.userService.getUsuariosTalleres(pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.usuarios = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los Modelos:', err);
      },
    });
  }


  agregarUsuarioTaller(){

  }


  agregarUsuarioCliente(){

  }

}

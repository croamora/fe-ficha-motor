import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TallerService } from 'src/app/services/taller.service';


interface productcards {
  id: number;
  imgSrc: string;
  title: string;
  location: string;
  rprice: string;
}

@Component({
  selector: 'app-descubrir',
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
    MatPaginator
  ],
  templateUrl: './descubrir.component.html',
  styleUrl: './descubrir.component.scss'
})
export class DescubrirComponent implements OnInit {

  pageIndex:number;
  length:number;
  palabraClave: string;
  talleres: any[] = [];

  constructor(
    private router: Router,
    private tallerService: TallerService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit(): void {
    this.palabraClave = "";
    this.callData(); 
  }
  

  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?:PageEvent){
    let pageNum = event != null ? (event.pageIndex + 1) : 1;
    let pageSize = event != null ? event.pageSize : 12;
    this.spinner.show();
    this.tallerService.getTalleres(pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = (response.pageNum - 1);
        this.length = response.total;
        this.talleres = response.list;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los talleres:', err);
      },
    });
  }

  navigateTo(epresaId: number): void {
    this.router.navigate([`/descubrir/detalle-empresa/${epresaId}`]);
  }

}

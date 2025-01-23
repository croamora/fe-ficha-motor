import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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
import { AdsService } from 'src/app/services/ads.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-ads',
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
    MatTabsModule,
    MatChipsModule,
    CdkDropList,
    CdkDrag,
    MatListModule
  ],
  templateUrl: './admin-ads.component.html',
  styleUrl: './admin-ads.component.scss'
})
export class AdminAdsComponent implements OnInit {

  ads: any[];
  pageIndex: number;
  length: number;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private storageService: StorageService, 
    private snackBar: MatSnackBar,
    private adsService: AdsService
  ) {}
  
  ngOnInit(): void {
    this.callData();
  }

  public getServerData(event:PageEvent){
    this.callData(event);
  }


  public callData(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 12;
    this.spinner.show();
    this.adsService.getAllAdsPage(pageNum, pageSize).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.ads = response.list;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los Ads:', err);
      },
    });
  }


  agregarAds(){

  }

}

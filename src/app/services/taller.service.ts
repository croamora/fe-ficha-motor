import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';
import { StorageService } from './storage.service';


@Injectable({ providedIn: 'root' })
export class TallerService {
          

    public stores : any[];
    public selectedStore: any;
    
    private readonly apiUrl = environment.apiEndpoint + 'taller';

    constructor(
        private http:HttpClient, 
        private storageService:StorageService
    ) {}


    getTalleres(pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }


    getTalleresPorGeo(pageNum: number, pageSize: number, palabraClave: string, latitud: number, longitud: number, radio: number) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '/userFilter?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave 
        if(latitud){
            finalurl = finalurl + '&latitud=' + latitud
        }
        if(latitud){
            finalurl = finalurl + '&longitud=' + longitud +'&radio=' + radio
        }
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }
    


    getTalleresById(idTaller: string) : Observable<any> {
        return this.http.get<PaginationModel>(this.apiUrl + '/' + idTaller, { withCredentials: true });
    }

    getTallerToEditById(idTaller: string) : Observable<any> {
        return this.http.get<any>(this.apiUrl + '/data/' + idTaller, { withCredentials: true });
    }


    createTaller(tallerData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, tallerData);
      }
    
    updateTaller(idTaller: string, tallerData: FormData): Observable<any> {
        return this.http.put(this.apiUrl + '/' + idTaller, tallerData);
    }

    deleteTaller(id: number) : Observable<any>{
        return this.http.delete(this.apiUrl + '/' + id, { withCredentials: true });
    }


    getTalleresByIdUser() : Observable<any[]>{
        return this.http.get<any>(this.apiUrl + '/stores', { withCredentials: true });
    }


}

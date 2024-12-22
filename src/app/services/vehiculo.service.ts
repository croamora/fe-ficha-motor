import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';


@Injectable({ providedIn: 'root' })
export class VehiculoService {
    

    private readonly apiUrl = environment.apiEndpoint + 'vehiculo';

    constructor(private http:HttpClient) {}


    getVehiculos(pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }

    getMisVehiculos() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
    }


    getVehiculoById(idVehiculo: string) : Observable<any> {
        return this.http.get<PaginationModel>(this.apiUrl + '/' + idVehiculo, { withCredentials: true });
    }
}

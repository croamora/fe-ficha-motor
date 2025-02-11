import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';


@Injectable({ providedIn: 'root' })
export class VehiculoService {
      
    private readonly apiUrl = environment.apiEndpoint + 'vehiculo';

    constructor(private http:HttpClient) {}

    checkVehicle(patente: string) : Observable<boolean>{
        return this.http.get<boolean>(this.apiUrl + '/existe/' + patente, { withCredentials: true });
    }

    getVehiculos(pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }

    getMisVehiculos() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl + '/client', { withCredentials: true });
    }

    getVehiculoById(idVehiculo: string) : Observable<any> {
        return this.http.get<PaginationModel>(this.apiUrl + '/' + idVehiculo, { withCredentials: true });
    }

    getVehiculoByPatente(patente: string) : Observable<any> {
        return this.http.get<PaginationModel>(this.apiUrl + '/patente/' + patente, { withCredentials: true });
    }

    save(newVehiculo: any) : Observable<any>{
        return this.http.post<any>(this.apiUrl, newVehiculo, { withCredentials: true });
    }

    update(newVehiculo: any) : Observable<any>{
        return this.http.put<any>(this.apiUrl + '/' + newVehiculo.id, newVehiculo, { withCredentials: true });
    }

    getClientByIdVehicle(id: number) : Observable<any>{
        return this.http.get<any>(this.apiUrl + '/' + id + '/client' , { withCredentials: true });
    }
}

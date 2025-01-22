import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';
import { Servicio } from '../models/servicio-model';


@Injectable({ providedIn: 'root' })
export class ServicioService {

   
    private readonly apiUrl = environment.apiEndpoint + 'servicio';

    constructor(private http:HttpClient) {}


    getServiciosByTaller(idTaller: number, pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + "/" + idTaller + "/page" + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }


    createServicio(newServicio: Servicio) : Observable<any> {
        return this.http.post<any>(this.apiUrl  + "/" + newServicio.idTaller, newServicio, { withCredentials: true });
    }

    updateServicio(servicio: Servicio) : Observable<any> {
        return this.http.put<any>(this.apiUrl  + "/" + servicio.idTaller, servicio, { withCredentials: true });
    }

    deleteServicio(id: number) : Observable<any>{
        return this.http.delete(this.apiUrl + '/' + id, { withCredentials: true });
    }
}

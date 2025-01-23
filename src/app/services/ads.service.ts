import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';
import { Servicio } from '../models/servicio-model';


@Injectable({ providedIn: 'root' })
export class AdsService {

   
    private readonly apiUrl = environment.apiEndpoint + 'ads';

    constructor(private http:HttpClient) {}


    getAllAdsPage(pageNum: number, pageSize: number) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + "/page" + '?pageNum='+pageNum+'&pageSize='+pageSize
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }


    // createServicio(newServicio: Servicio) : Observable<any> {
    //     return this.http.post<any>(this.apiUrl  + "/" + newServicio.idTaller, newServicio, { withCredentials: true });
    // }

    // updateServicio(servicio: Servicio) : Observable<any> {
    //     return this.http.put<any>(this.apiUrl  + "/" + servicio.idTaller, servicio, { withCredentials: true });
    // }

    // deleteServicio(id: number) : Observable<any>{
    //     return this.http.delete(this.apiUrl + '/' + id, { withCredentials: true });
    // }
}

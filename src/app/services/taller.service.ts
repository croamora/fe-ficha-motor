import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';


@Injectable({ providedIn: 'root' })
export class TallerService {
    

    private readonly apiUrl = environment.apiEndpoint + 'taller';

    constructor(private http:HttpClient) {}


    getTalleres(pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }


    getTalleresById(idTaller: string) : Observable<any> {
        return this.http.get<PaginationModel>(this.apiUrl + '/' + idTaller, { withCredentials: true });
    }
}

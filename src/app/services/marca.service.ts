import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';


@Injectable({ providedIn: 'root' })
export class MarcaService {
    

    private readonly apiUrl = environment.apiEndpoint + 'marca';

    constructor(private http:HttpClient) {}


    getMarcas() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
    }

    getPaginMarcas(pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + "/page" + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }

    getModelosByMarca(idMarca: string) : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl + '/' + idMarca + '/modelos', { withCredentials: true });
    }

    getPaginModelosByMarcas(idModelo: string, pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + "/" + idModelo + "/modelos/page" + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }

    

}

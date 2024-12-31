import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';
import { Marca } from '../models/marca-model';


@Injectable({ providedIn: 'root' })
export class MarcaService {
   
    private readonly apiUrl = environment.apiEndpoint + 'marca';

    constructor(private http:HttpClient) {}


    getMarcas() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
    }

    getMarca(marcaId: string) : Observable<Marca> {
        return this.http.get<Marca>(this.apiUrl + "/" + marcaId, { withCredentials: true });
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

    deleteMarca(idMarca: number) : Observable<any> {
        return this.http.delete<any>(this.apiUrl + "/" + idMarca, { withCredentials: true });
    }

    updateMarca(marca: any) : Observable<any> {
        return this.http.put<any>(this.apiUrl, marca, { withCredentials: true });
    }

    createMarca(marca: any) : Observable<any> {
        return this.http.post<any>(this.apiUrl, marca, { withCredentials: true });
    }


    deleteModelo(idMarca: number | null | undefined, idModelo: number) {
        return this.http.delete<any>(this.apiUrl + "/" + idMarca + "/modelos/" + idModelo, { withCredentials: true });
    }

    updateModelo(modelo: any) : Observable<any> {
        return this.http.put<any>(this.apiUrl + "/" + modelo.idMarca + "/modelos" , modelo, { withCredentials: true });
    }

    createModelo(modelo: any) : Observable<any> {
        return this.http.post<any>(this.apiUrl + "/" + modelo.idMarca + "/modelos" , modelo, { withCredentials: true });
    }

}

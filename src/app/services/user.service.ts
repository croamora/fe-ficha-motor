import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';


@Injectable({ providedIn: 'root' })
export class UserService {


    
    private readonly apiUrl = environment.apiEndpoint + 'usuario';

    constructor(private http:HttpClient) {}


    getUsuariosTalleres(pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '/store?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }

    getUsuariosClientes(pageNum: number, pageSize: number, palabraClave: string) {
        let finalurl = this.apiUrl + '/clients?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }


    getUsersStore(idStore: number, pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '/store/' + idStore + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }

    getByEmail(email: string) : Observable<any> {
        let finalurl = this.apiUrl + '/getByEmail?email=' + email;
        return this.http.get<any>(finalurl, { withCredentials: true });
    }
    
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';


@Injectable({ providedIn: 'root' })
export class WorkOrderService {
    
    
    
    private readonly apiUrl = environment.apiEndpoint + 'workOrder';

    constructor(private http:HttpClient) {}


    getWorkOrders(idStore: number,pageNum: number, pageSize: number, palabraClave: string) : Observable<PaginationModel>{
        let finalurl = this.apiUrl + '/store/' + idStore + '?pageNum='+pageNum+'&pageSize='+pageSize+'&palabraClave='+ palabraClave
        return this.http.get<PaginationModel>(finalurl, { withCredentials: true });
    }
    
}

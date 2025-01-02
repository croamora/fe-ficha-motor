import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../models/pagination-model';
import { Marca } from '../models/marca-model';


@Injectable({ providedIn: 'root' })
export class RegionService {
   
    private readonly apiUrl = environment.apiEndpoint + 'region';

    constructor(private http:HttpClient) {}


    getRegiones() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
    }

    getComunasByRegion(regionId: string) : Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + "/" + regionId + "/comunas", { withCredentials: true });
    }


}

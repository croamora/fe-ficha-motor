import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class DataService {
   
    private readonly apiUrl = environment.apiEndpoint + 'data';

    constructor(private http:HttpClient) {}


    getAllCombustibleType() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl + "/combustible", { withCredentials: true });
    }


    getAllVehicleType() : Observable<any[]>{
        return this.http.get<any[]>(this.apiUrl + "/vehicleType", { withCredentials: true });
    }
}

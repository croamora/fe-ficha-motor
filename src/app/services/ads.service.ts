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

    getAdsById(adsId: string) : Observable<any> {
        return this.http.get<any>(this.apiUrl + '/' + adsId, { withCredentials: true });
    }

    createAds(adsToSend: FormData) : Observable<any> { 
        return this.http.post(this.apiUrl, adsToSend);
    }

    updaAds(id: any, adsToSend: FormData) : Observable<any> { 
        return this.http.put(this.apiUrl + '/' + id, adsToSend);
    }

    deleteAds(id: number) : Observable<any>{
        return this.http.delete(this.apiUrl + '/' + id, { withCredentials: true });
    }
}

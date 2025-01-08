import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class StorageService {
          

    constructor(private http:HttpClient) {}


    saveStores(stores: any[]) : void{
        localStorage.setItem("stores", JSON.stringify(stores));
    }

    saveSelectedStore(store: any) : void{
        localStorage.removeItem('selectedStore');
        localStorage.setItem("selectedStore", JSON.stringify(store));
    }

    getStores() : any[] {
        var storesStr = localStorage.getItem('stores');
        return (storesStr) ? JSON.parse(storesStr) : [];
    }

    getSelectedStore() : any {
        var selectedStoreStr = localStorage.getItem('selectedStore');
        return (selectedStoreStr) ? JSON.parse(selectedStoreStr) : [];
    }

    removeStores(){
        localStorage.removeItem('stores');
    }

    removeSelectedStore(){
        localStorage.removeItem('selectedStore');
    }

    removeAll(){
        this.removeStores();
        this.removeSelectedStore();
    }
}

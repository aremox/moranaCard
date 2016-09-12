import {Injectable} from '@angular/core';  
import {Http, Headers} from '@angular/http';

@Injectable()
export class Imagen {  
    constructor(private http: Http) {
    }

    getCoordenadas(direccion) {
        let repos = this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${direccion}`);
        return repos;
    }
}
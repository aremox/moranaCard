import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class GoogleAPIService {
    constructor(private http: Http) {
    }

    getCoordenadas(direccion) {
        let repos = this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${direccion}`);
        return repos;
    }

    getDireccion(latitud, longitud) {
        let repos = this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}`);
        return repos;
    }

    getDetails(repo){
        let headers = new Headers();
        headers.append('Accept', 'application/vnd.github.VERSION.html');

        return this.http.get(`${repo.url}/readme`, {headers: headers});
    }

}

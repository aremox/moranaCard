import {Injectable} from '@angular/core';
import { Component } from '@angular/core';
import {NavController, AlertController, Platform} from 'ionic-angular';


declare var navigator: any;
declare var Connection: any;

@Injectable()
export class NetworkService {


  constructor(private navCtrl: NavController, private platform: Platform, private alertCtrl: AlertController) {
  }

  public tipoConexion():any {
    return this.platform.ready().then(() => {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            console.log("La conexion es: "+states[networkState]);
            return Promise.resolve(states[networkState]);
        }, (err) => {
          return Promise.reject(err);
        });
  }

public checkConnection(): any {
  return this.platform.ready().then(() => {
          var networkState = navigator.connection.type;
          var states = {};
          states[Connection.UNKNOWN]  = false;
          states[Connection.ETHERNET] = true;
          states[Connection.WIFI]     = true;
          states[Connection.CELL_2G]  = true;
          states[Connection.CELL_3G]  = true;
          states[Connection.CELL_4G]  = true;
          states[Connection.CELL]     = true;
          states[Connection.NONE]     = false;
          console.log("La conexion es: "+navigator.connection.type);
          return Promise.resolve(states[networkState]);
      }, (err) => {
        return Promise.reject(err);
      });
}

}

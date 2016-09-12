import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite} from 'ionic-native';

/*
  Generated class for the ListaLugaresPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/lista-lugares/lista-lugares.html',
})
export class ListaLugaresPage {
    public database: SQLite;
    public lugares: Array<Object>;

  constructor(private navCtrl: NavController) {
      this.database = new SQLite();
        this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
            this.refresh();
        }, (error) => {
            console.log("ERROR: ", error);
        });
  }
    
    public refresh() {
         console.log("invocando refresh");
        this.database.executeSql("SELECT * FROM lugares", []).then((data) => {
            console.log("SELECT: " + JSON.stringify(data));
            this.lugares = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.lugares.push({id: data.rows.item(i).id, nombre: data.rows.item(i).nombre, telefono: data.rows.item(i).telefono, categoria: data.rows.item(i).categoria, imagen: "data:image/jpeg;base64," +data.rows.item(i).imagen, latitud: data.rows.item(i).latitud, longitud: data.rows.item(i).longitud});
                    
                    console.log("SELECT: id:"+ data.rows.item(i).id+", nombre: "+data.rows.item(i).nombre+", categoria: "+data.rows.item(i).categoria+", latitud: "+data.rows.item(i).latitud+", longitud: "+data.rows.item(i).longitud+", telefono: "+data.rows.item(i).telefono+", imagen: "+data.rows.item(i).imagen);
                }
                console.log(JSON.stringify(this.lugares));
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

}

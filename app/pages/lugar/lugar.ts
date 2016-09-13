import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController, AlertController  } from 'ionic-angular';
import {Camera, Geolocation, SQLite, Base64ToGallery} from 'ionic-native';
import {GoogleAPIService} from '../../services/googleapi';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListaLugaresPage } from '../lista-lugares/lista-lugares';

/*
  Generated class for the LugarPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var cordova: any;
declare var window;
const fs:string = cordova.file.dataDirectory;

@Component({
  templateUrl: 'build/pages/lugar/lugar.html',
    providers: [GoogleAPIService],
})

export class LugarPage {
    @ViewChild('imagenCANVAS') canvasRef;
    @ViewChild('imagenBASEhtml') imageRef;
    private nombre: string;
    private telefono: number;
    public foundDirecciones;
    public direccion;
    public coordenada: number[] = [0,0];
    public base64Image: string;
    public database: SQLite;
    public lugares: Array<Object>;
    private fotoBase64: string;
    private categoria: string;
     private controlClic: boolean = false;
    form;

  


  constructor(private navCtrl: NavController, public platform: Platform, private googleapi: GoogleAPIService, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
      this.form = new FormGroup({
          fotoBase64Form: new FormControl("", Validators.required),
          nombre: new FormControl("", Validators.required),
          telefono: new FormControl("", Validators.required),
          categoria: new FormControl("", Validators.required),
          direccion: new FormControl("", Validators.required)
      });
      
        
        this.database = new SQLite();
        this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
            console.log("OK: Conecta con la bbdd");
            this.reset();
        }, (error) => {
            console.log("ERROR: ", error);
        });
        
  }
//saveToPhotoAlbum: true
takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation:true
        
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        //this.base64Image = imageData;
        //console.log("La imagen esta en: "+imageData);
        this.fotoBase64 = imageData;
        
        Base64ToGallery.base64ToGallery(imageData, 'img_').then(
            res =>{ 
                //this.base64Image = res;
                //  this.fotoBase64 = res;
                console.log('Saved image to gallery ', res);
            },err => console.log('Error saving image to gallery ', err)
        );
    }, (err) => {
        console.log(err);
    });
}

takePictureGaleria(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation:true
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.fotoBase64 = imageData;           
    }, (err) => {
        console.log(err);
    });
  }

presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
        cssClass: 'action-sheets-basic-page',
        title: 'Añadir foto',
        buttons: [
        {
          text: 'Galeria',
            icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
              this.takePictureGaleria();
            console.log('Destructive clicked');
          }
        },{
          text: 'Camara',
            icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
              this.takePicture();
            console.log('Camara clicked');
          }
        },{
          text: 'Cancelar',
            icon: !this.platform.is('ios') ? 'close-circle' :null,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

getCoordenadas() {
        this.googleapi.getCoordenadas(this.direccion).subscribe(
            data => {
            //    data.json();
                let lugares = data.json();
                 this.foundDirecciones = lugares.results;
                console.log(lugares.results);
            },
            err => console.error(err),
            () => console.log('getRepos completed')
        );
    }

setDireccion(lugar) {
    this.direccion = lugar.formatted_address;
    this.coordenada[0] = lugar.geometry.location.lat;
    this.coordenada[1] = lugar.geometry.location.lng;
    this.foundDirecciones = null;
    console.log('Direccion establecida a: '+this.direccion+" "+this.coordenada[0]+" "+this.coordenada[1]);
}

getDireccion(latitud,longitud){
    this.googleapi.getDireccion(latitud,longitud).subscribe(
            data => {
            //    data.json();
                let lugares = data.json();
                 this.foundDirecciones = lugares.results;
                console.log(lugares.results);
            },
            err => console.error(err),
            () => console.log('getRepos completed')
        );
}

getGPS() {
    Geolocation.getCurrentPosition().then((resp) => {
        this.coordenada[0] = resp.coords.latitude;
        this.coordenada[1] = resp.coords.longitude;
        console.log(resp.coords.latitude+" "+resp.coords.longitude);
        this.getDireccion(resp.coords.latitude,resp.coords.longitude);
    })
}

onSubmit() {
    
    this.controlClic=true;
    let alert = this.alertCtrl.create({
      title: "Account Created",
      message: "Se a registrado un nuevo lugar. ",
      buttons: [{
        text: 'Ok',
      }]
    });
    if (this.form.status === 'VALID') {
        console.log("Pulsar boton de sumit");
        console.log(this.nombre+" "+ this.coordenada[0]+" "+this.coordenada[1]+" "+this.telefono);
        this.add();
        alert.present();
    }else{
        console.log("Pulsar boton de sumit CON ERROR :"+this.form.status);
    }
  }

    public add() {
         console.log("invocando add: '"+this.nombre.toLowerCase()+"', '"+ this.coordenada[0]+"', '"+this.coordenada[1]+"', '"+this.categoria+"', '"+this.fotoBase64+"'");
        
        //"INSERT INTO lugares (nombre, latitud, longitud, telefono, categoria, imagen) VALUES ('"+this.nombre.toLowerCase()+"', '"+ this.coordenada[0]+"', '"+this.coordenada[1]+"', '"+this.telefono+"', '"+this.categoria+"', '"+this.fotoBase64+"')"
        
        this.database.executeSql("INSERT INTO lugares (nombre, latitud, longitud, telefono, categoria, imagen) VALUES ('"+this.nombre.toLowerCase()+"', '"+ this.coordenada[0]+"', '"+this.coordenada[1]+"', '"+this.telefono+"', '"+this.categoria+"', '"+this.fotoBase64+"')", []).then((data) => {
            console.log("INSERTED: " + JSON.stringify(data));
            //this.refresh();
            //this.navCtrl.setRoot(ListaLugaresPage);
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
        });
    }
 
    public refresh() {
         console.log("invocando refresh");
        this.database.executeSql("SELECT * FROM lugares", []).then((data) => {
            console.log("SELECT: " + JSON.stringify(data));
            this.lugares = [];
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.lugares.push({id: data.rows.item(i).id, nombre: data.rows.item(i).nombre, telefono: data.rows.item(i).categoria});
                    console.log("SELECT: id:"+ data.rows.item(i).id+", nombre: "+data.rows.item(i).nombre+", categoria: "+data.rows.item(i).categoria+", latitud: "+data.rows.item(i).latitud+", longitud: "+data.rows.item(i).longitud+", telefono: "+data.rows.item(i).telefono+", imagen: NO PINTAMOS");
                }
                console.log(JSON.stringify(this.lugares));
                this.reset();
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

private reset(){
    this.nombre = null;
    this.direccion = null;
    this.coordenada[0] = null;
    this.coordenada[1] = null;
    this.telefono = null;
    this.categoria = null;
    this.base64Image = "build/images/foto.jpg";
}
     
     private getDataUri(url, callback):any {
         var imageEnHTML = new Image();
         
          imageEnHTML.onload = () => {  
       console.log("URL en el canvas: "+imageEnHTML.src);
                let canvas = this.canvasRef.nativeElement;
                //canvas.width = 100; // or 'width' if you want a special/scaled size
                //canvas.height = 100; // or 'height' if you want a special/scaled size
                canvas.getContext('2d').drawImage(imageEnHTML, 0, 0);

                // Get raw image data
                callback(canvas.toDataURL('image/jpg').replace(/^data:image\/(png|jpg);base64,/, ''));
                
                // ... or get as Data URI
                //callback(canvas.toDataURL('image/png')); 
          };
         imageEnHTML.src = url;
        }
     
     private sleep(milliseconds, callback) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
	    if ((new Date().getTime() - start) > milliseconds){
	    	//alert("FIN");
	    	callback();
	      break;
	    }
	  }
	}


}

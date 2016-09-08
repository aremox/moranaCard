import { Component } from '@angular/core';
import { NavController, Platform, ActionSheetController  } from 'ionic-angular';
import {Camera, Geolocation} from 'ionic-native';
import {GoogleAPIService} from '../../services/googleapi';

/*
  Generated class for the LugarPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/lugar/lugar.html',
    providers: [GoogleAPIService],
})
export class LugarPage {
    public foundDirecciones;
    public direccion;
    public coordenada: number[] = [0,0];
    public base64Image: string;
  


  constructor(private navCtrl: NavController, public platform: Platform, private googleapi: GoogleAPIService, public actionSheetCtrl: ActionSheetController) {
        this.base64Image = "build/images/foto.jpg";
       
        
  }

takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        targetWidth: 1000,
        targetHeight: 1000,
        saveToPhotoAlbum: true
    }).then((imageData) => {
      // imageData is a base64 encoded string
        //this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64Image = imageData;
    }, (err) => {
        console.log(err);
    });
  }

takePictureGaleria(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        //this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64Image = imageData;
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
    this.foundDirecciones = null;
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
    console.log("Pulsar boton de sumit");
    console.log(this.coordenada[0]+" "+this.coordenada[1]);
  }



}

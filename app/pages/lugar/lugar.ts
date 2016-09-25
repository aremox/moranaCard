import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController, AlertController  } from 'ionic-angular';
import {Camera, Geolocation, SQLite, Base64ToGallery} from 'ionic-native';
import {GoogleAPIService} from '../../services/googleapi';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListaLugaresPage } from '../lista-lugares/lista-lugares';
import {Imagen} from '../../services/imagen';
import { LugarModel } from '../../model/lugar';
import { NetworkService } from '../../services/network';


/*
Generated class for the LugarPage page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/

declare var cordova: any;
declare var window;
declare var navigator: any;
//const fs:string = cordova.file.dataDirectory;

@Component({
  templateUrl: 'build/pages/lugar/lugar.html',
  providers: [GoogleAPIService, Imagen, LugarModel, NetworkService ]
})

export class LugarPage {
  @ViewChild('imagenCANVAS') canvasRef;
  @ViewChild('imagenBASEhtml') imageRef;
  private nombre: string;
  private telefono: number;
  public foundDirecciones;
  public direccion = null;
  public coordenada: number[] = [0,0];
  public base64Image: string;
  public database: SQLite;
  public lugares: Array<Object>;
  private fotoBase64;
  private categoria: string;
  private controlClic: boolean = false;
  form;




  constructor(private navCtrl: NavController, public platform: Platform, private googleapi: GoogleAPIService,
    private net: NetworkService,
    public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public imagenClass: Imagen, private lugarModel: LugarModel) {
      this.form = new FormGroup({
        fotoBase64Form: new FormControl("", Validators.required),
        nombre: new FormControl("", Validators.required),
        telefono: new FormControl("", Validators.required),
        categoria: new FormControl("", Validators.required),
        direccion: new FormControl("", Validators.required)
      });
        this.reset();
        net.checkConnection().then(data => {
          console.log("Estado de la conexion: "+ data);
        } );


    }

    public clickFotoCamara(){
      this.imagenClass.getFotoCamara(function(data, contexto){
          contexto.base64Image = "data:image/jpeg;base64," + data;
          contexto.fotoBase64 = data;
      },this);
  }

  public clickFotoGaleria(){
    this.imagenClass.getFotoGaleria(function(data, contexto){
        contexto.base64Image = "data:image/jpeg;base64," + data;
        contexto.fotoBase64 = data;
    },this);
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
              this.clickFotoGaleria();
              console.log('Destructive clicked');
            }
          },{
            text: 'Camara',
            icon: !this.platform.is('ios') ? 'camera' : null,
            handler: () => {
              this.clickFotoCamara();
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
      console.log("Pulsar boton de sumit");
      this.controlClic=true;
      let alert = this.alertCtrl.create({
        title: "Lugar creado",
        message: "Se a registrado un nuevo lugar. ",
        buttons: [{
          text: 'Ok',
        }]
      });
      let alertError = this.alertCtrl.create({
        title: "Dirección incorrecta",
        message: "Por favor introduzca una dirección correcta. ",
        buttons: [{
          text: 'Ok',
        }]
      });
      if (this.form.status === 'VALID') {
        console.log(this.coordenada);
        if((this.coordenada[0] != null)&&(this.coordenada[1] != null)){

          this.lugarModel.setLugar(this.nombre, this.fotoBase64, this.coordenada[0], this.coordenada[1], this.telefono, this.categoria).then((data) => {
            console.log("insertado correctamente: "+data);
            this.addLugar().then(() => {
              this.reset();
              console.log("insercion correcta");

            }, (err) => {
              console.log("Error en onSubmit: "+err);
            });
            alert.present();
          });
        }else{
          alertError.present();
        }
      }else{
        console.log("Pulsar boton de sumit CON ERROR :"+this.form.status);
      }
    }

    public addLugar() {

      return this.lugarModel.insetBBDD().then((data) =>{
        console.log("invocando add: "+data);
        return Promise.resolve("OK add");
      },(err) =>{
        console.log("Error en el addLugar: "+err);
        return Promise.reject("Error en el addLugar: "+err);
      });


    }

    private reset(){
      this.controlClic=false;
      this.nombre = null;
      this.direccion = null;
      this.coordenada[0] = null;
      this.coordenada[1] = null;
      this.telefono = null;
      this.categoria = null;
      this.base64Image = "build/images/foto.jpg";
    }


  }

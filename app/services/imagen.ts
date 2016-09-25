import {Injectable, ViewChild} from '@angular/core';
import {Camera, Base64ToGallery} from 'ionic-native';

@Injectable()
export class Imagen {

  @ViewChild('imagenCANVAS') canvasRef;
  @ViewChild('imagenBASEhtml') imageRef;

  constructor( ) {

  }

  //saveToPhotoAlbum: true
  public getFotoCamara(callback, contexto): any {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation:true

    }).then((imageData) => {

      callback( imageData,contexto );

      Base64ToGallery.base64ToGallery(imageData, 'img_').then(
        res =>{
          console.log('Saved image to gallery ', res);

        },err => {
          console.log('Error saving image to gallery ', err);

        }
      );
    }, (err) => {
      console.log(err);
    });
  }

  public getFotoGaleria(callback, contexto){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation:true
    }).then((imageData) => {

      callback( imageData,contexto );
    }, (err) => {
      console.log(err);

    });
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

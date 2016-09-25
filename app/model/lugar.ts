import {SQLite} from 'ionic-native';

export class LugarModel {

 public nombre: string;
 public foto: string;
 public direccion: string;
 public telefono: string;
 public latitud: string;
 public longitud: string;
 public categorias: string[];
 public database: SQLite;
 public lugares: any[];

    constructor( ){
      this.database = new SQLite();
      this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
        console.log("OK: Conecta con la bbdd");

      }, (error) => {
        console.log("ERROR: ", error);
      });
    }
    public getHola(): string {

      return "hola";
    }
    // zona de seters
    setNombre(item){
        this.nombre = item;
    }
    setFoto(item){
        this.foto = item;
    }
    setDireccion(item){
        this.direccion = item;
    }
    setTelefono(item){
        this.telefono = item;
    }
    setLatitud(item){
        this.latitud = item;
    }
    setLongitud(item){
        this.longitud = item;
    }
    setCategorias(item){
        this.categorias = item;
    }
    addCategoria(item){
        this.categorias.push(item);
    }
    public setLugar(nombre, foto, latitud, longitud, telefono, categoria):any{
      console.info("En el metodo setLugar");
        this.nombre = nombre.toLowerCase();
        this.foto = foto;
        this.latitud = latitud;
        this.longitud = longitud
        this.telefono = telefono;
        this.setCategorias(categoria);
        console.log("invocando setLugar: '"+this.nombre+" "+this.foto+" "+this.latitud+" "+this.longitud+" "+this.telefono+" "+categoria+" "+this.getCategoriaItem(0));
        return Promise.resolve(categoria+" "+this.getCategoriaItem(0));
    }

    // zona de geterts
    getNombre(){
        return this.nombre;
    }

    getFoto(){
        return this.foto;
    }

    getDireccion(){
        return this.direccion;
    }

    getLatitud(){
        return this.latitud;
    }

    getLongitud(){
        return this.longitud;
    }

    getCategoria(){
        return this.categorias;
    }
    getCategoriaItem(numero){
        return this.categorias[numero];
    }

    public insetBBDD() {
     console.log("invocando add: '"+this.nombre+"', '"+ this.latitud+"', '"+this.longitud+"', '"+this.getCategoriaItem(0)+"', '"+this.foto+"'");

      //"INSERT INTO lugares (nombre, latitud, longitud, telefono, categoria, imagen) VALUES ('"+this.nombre.toLowerCase()+"', '"+ this.coordenada[0]+"', '"+this.coordenada[1]+"', '"+this.telefono+"', '"+this.categoria+"', '"+this.fotoBase64+"')"

      return this.database.executeSql("INSERT INTO lugares (nombre, latitud, longitud, telefono, categoria, imagen) VALUES('"+this.nombre+"', '"+ this.latitud+"', '"+this.longitud+"', '"+this.telefono+"', '"+this.getCategoriaItem(0)+"', '"+this.foto+"')", [])
      .then((data) => {
        //console.log("INSERTED: " + JSON.stringify(data));

        return Promise.resolve("OK");

      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error.err));
        return Promise.reject("KO");
      });
    }

    public refresh() {
  /*    console.log("invocando refresh");
      this.database.executeSql("SELECT * FROM lugares", []).then((data) => {
        console.log("SELECT: " + JSON.stringify(data));
        this.lugares = [];
        if(data.rows.length > 0) {
          for(var i = 0; i < data.rows.length; i++) {
            this.lugares.push({id: data.rows.item(i).id, nombre: data.rows.item(i).nombre, telefono: data.rows.item(i).categoria});
            console.log("SELECT: id:"+ data.rows.item(i).id+", nombre: "+data.rows.item(i).nombre+", categoria: "+data.rows.item(i).categoria+", latitud: "+data.rows.item(i).latitud+", longitud: "+data.rows.item(i).longitud+", telefono: "+data.rows.item(i).telefono+", imagen: NO PINTAMOS");
          }
          console.log(JSON.stringify(this.lugares));
        }
      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
      });*/
    }

}

import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar, SQLite } from 'ionic-native';

import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { LugarPage } from './pages/lugar/lugar';
import { ListaLugaresPage } from './pages/lista-lugares/lista-lugares';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = Page1;
   rootPage: any = ListaLugaresPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

      let db = new SQLite();
            db.openDatabase({
                name: "data.db",
                location: "default"
            }).then(() => {
                //db.executeSql("DROP TABLE lugares",{}).then((data) => {console.log("TABLE DROP: ", data);}, (error) => {console.error("Unable to execute sql DROP", error);})
                db.executeSql("CREATE TABLE IF NOT EXISTS lugares (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, latitud TEXT, longitud TEXT, telefono TEXT, categoria TEXT, imagen TEXT, descripcion TEXT)", {}).then((data) => {
                    console.log("TABLE CREATED: ", data);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
            }, (error) => {
                console.error("Unable to open database", error);
            });

    // used for an example of ngFor and navigation
    this.pages = [
        { title: 'Lugares', component: ListaLugaresPage },
      { title: 'Page uno', component: Page1 },
      { title: 'Page dos', component: Page2 },
        { title: 'Añadir un lugar', component: LugarPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);

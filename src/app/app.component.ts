import { environment } from './../environments/environment';
import { Component, ViewChild } from '@angular/core';
import { App, Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { AngularFire } from 'angularfire2';
//import * as firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { AuthProvider } from '../providers/auth-provider';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  isLoggedIn:boolean = false;
  rootPage:any = HomePage;
  @ViewChild(Nav)nav:Nav;
  mapPage:any = MapPage;
  currentUser;
  userData;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    public auth: AuthProvider,
    public app: App
  ) {

    this.pages = [
      { title: 'Logout', component: 'HomePage' },
      { title: 'Map', component: 'MapPage'}
    ];

    //this.currentUser = this.auth.userData;
    //this.userData = this.auth.currentUser;
    //this.rootPage = HomePage;

    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    //firebase.initializeApp(environment.firebaseConfig);
  }

  login() {
    this.currentUser = this.auth.userData;
  }

  getUsers(): void {
    this.userData = this.auth.currentUser.email;
  }

  logout(Page) {
    this.auth.logout;
    var nav = this.app.getRootNav();
    nav.setRoot(HomePage);
    //this.nav.setRoot(HomePage);
  }

}


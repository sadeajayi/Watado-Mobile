import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
//import { Camera } from '@ionic-native/camera';
import { FormControl , FormsModule, ReactiveFormsModule, FormGroup } from "@angular/forms";
import { Geolocation } from '@ionic-native/geolocation';

import { NativeStorage } from '@ionic-native/native-storage';
import { Device } from '@ionic-native/device';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { ProfilePage } from '../pages/profile/profile';

import { AgmCoreModule, MapsAPILoader, CircleManager, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmJsMarkerClustererModule, ClusterManager } from "@agm/js-marker-clusterer";

//import * as firebase from 'firebase';
import { SocketService } from '../shared/socket.service';
import { MarkerService } from "../shared/marker.service";
import { HttpModule } from '@angular/http';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AuthProvider } from '../providers/auth-provider';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

//const config: SocketIoConfig = { url: 'http://localhost:3000', options: {}};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, 
    ReactiveFormsModule,
   // SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp),
    //firebase.initializeApp(environment.firebaseConfig),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
   AgmCoreModule.forRoot({
    apiKey: 'AIzaSyAgWE4V1Lk7-202HEG5i2-KfYyyTk01iSk',
    libraries: ["places"]
  }),
  AgmJsMarkerClustererModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    Facebook,
    GooglePlus,
    AuthProvider,
    AngularFireAuth,
    AngularFireDatabase,
    //Camera,
    BackgroundGeolocation,
    Geolocation,
    SocketService,
    Device,
    MarkerService,
    ClusterManager,
    CircleManager,
    GoogleMapsAPIWrapper,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

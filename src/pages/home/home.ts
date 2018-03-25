import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { MapPage } from '../map/map';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AuthProvider } from '../../providers/auth-provider';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  FB_APP_ID: number = 1612389408838431;
  tab1Root: any = MapPage;

  isLoggedIn:boolean = false;
  users: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    private auth: AuthProvider,
    private menu : MenuController,
    private nativeStorage: NativeStorage
  ) {
    
   this.menu.enable(false);
    googlePlus.login()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }).catch(e => console.log(e));

    fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));

  }

  logout(): void{
    this.auth.logout;
    this.isLoggedIn = false;
   
  }

  loginWithFacebook(): void{
   this.navCtrl.setRoot(MapPage);
    /* this.auth.loginWithFacebook().subscribe((success) =>{
    console.log(success);
    this.fb.api("/me?fields=id,name,email,first_name", []).then(profile => {
        this.users = {email: profile['email'], first_name: profile['first_name'], username: profile['name']}
      });   
    this.navCtrl.setRoot(MapPage);
    this.menu.enable(true);
    }, err => {
    console.log(err);
    });  */ 
    
  }

  loginWithGmail(): void{
    this.auth.loginWithGmail().subscribe((success) =>{
    console.log(success);
    this.navCtrl.setRoot(MapPage);
    this.menu.enable(true);
    }, err => {
    console.log(err);
    });
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
    
  }

  getUserDetail(userId){
    this.fb.api("/"+userId+"/?fields=id,email,name,picture",["public_profile"])
      .then(res => {
        console.log(res);
        this.users = res;
      })
      .catch(e => {
        console.log(e);
      });
  }

}

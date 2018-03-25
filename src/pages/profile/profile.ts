import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { AuthProvider } from '../../providers/auth-provider';


export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

//@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  rootPage:any = MapPage;

  @ViewChild(Nav) nav: Nav;
  pages: PageInterface[] = [
    { title: 'Logout', pageName: 'HomePage', icon: 'shuffle' },
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private auth: AuthProvider,
    public home: HomePage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logout(event) {
    this.home.logout();
    this.navCtrl.push(HomePage);
  }

}


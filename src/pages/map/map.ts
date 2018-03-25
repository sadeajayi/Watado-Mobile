import { Component, NgModule, NgZone, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController } from 'ionic-angular';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { FormControl, FormGroup } from "@angular/forms";
import { AuthProvider } from '../../providers/auth-provider';
//import { ViewChild } from '@angular/core/src/metadata/di';
import { MarkerService } from '../../shared/marker.service';
//import { Device } from '@ionic-native/device';
import { AgmCoreModule, MapsAPILoader, CircleManager } from '@agm/core';
import { GoogleMapsClusterProvider } from '../../providers/google-maps-cluster/google-maps-cluster';
import * as MarkerClusterer from 'node-js-marker-clusterer';
//import { SocketService } from '../../shared/socket.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
declare var google: any;

//@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  
  map: any;
  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  markers: any = [];
  mark: Observable<any[]>;
  zoomControlOptions: AgmCoreModule;
  myGroup;
  searchControl: FormControl;

  dbRef: AngularFireList<any>;
  items: Observable<any[]>;
  clicks: boolean;
  geocoder: any;
  source: any;
  lat: number =  6.4471;
  lng: number = 3.4182;
  radius: number = 25;
  zoom: number;
  locationClicks: number = 0;
  allowPinDrop: boolean = false;
  placeid: any;
  
  //@ViewChild('map') mapElement: ElementRef;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild('inputElement') inputElement: ElementRef;

  constructor(
    private markerService: MarkerService, 
    private menu : MenuController,
   // private device: Device,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private zone: NgZone,
    private geolocation: Geolocation,
    private mapsAPILoader: MapsAPILoader,
    private circleManager: CircleManager,
    private auth: AuthProvider,
    private db: AngularFireDatabase,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController
   // public socket: Socket,
    //public _socketService: SocketService,
  ) {

    this.menu.enable(true);

    this.myGroup = new FormGroup({
      searchControl: new FormControl()
    });
    
    this.items = this.markerService.getMarkers();
    this.items.subscribe(data => {
      this.markers = data;
    });
  }
  

  mapClicked($event:any) {
    var newMarker = {
      name: 'Untitled',
      position: {lat:$event.coords.latitude, lng:$event.coords.longitude}
    };
    /* var newMarker = new google.maps.marker({
      name: 'Untitled',
      position: {lat:$event.coords.latitude, lng:$event.coords.longitude}
      //lat: $event.coords.lat,
      //lng: $event.coords.lng,
    }); */
    
  }


   selectSearchResult(item){
    this.clearMarkers();
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        let position = {
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng
        };
        let marker = {
          position: results[0].geometry.location,

        };

      //  this._socketService.emit('add-marker', position);
        this.map.setCenter(results[0].geometry.location);
      }
    })
  } 
 
  addMarker(location) {
/*     let marker = new google.maps.Marker({
      position: location,
      map: this.map
    }); */

    let marker = {
      lat: location.lat,
      lng: location.lng
    };
    //this._socketService.emit('add-marker', marker);
    this.markers.push(marker);
   //this.markerService.addMarker(marker.position);
    
  //this._socketService.emit('add-marker', marker.position);
    //this.clusterMarkers();
    //return marker;
  }

  //Called when user clicks location FAB
  locationPrompt(){
    let prompt = this.alertCtrl.create({
      title: 'Confirm Your Location',
      message: 'Do you want to drop a pin at your current location?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            //Displays pin on user's location
            this.userlocation();
          }
        }
      ]
    });
    prompt.present();

  }

  userlocation(){
    this.allowPinDrop = true;  
    this.locationClicks += 1;
    console.log(this.locationClicks); 
    //this.clearMarkers();

    if(this.locationClicks == 1) {
      console.log(this.locationClicks);
      this.geolocation.getCurrentPosition().then((resp) => {
        this.zoom = 18;
        let pos = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
          zoom: this.zoom,
          userName: this.auth.userData.name
        };
/*         ,
        zoom: this.zoom,
        userName: this.auth.userData.name */
        var geocoder = new google.maps.Geocoder;
        var service = new google.maps.places.PlacesService(document.createElement('div'));

        geocoder.geocode({'location': pos}, function(results, status){
          if(status == google.maps.GeocoderStatus.OK) {
            if(results[1]){
              console.log(results[0].place_id);
              service.getDetails({placeId: results[0].place_id
              },(placeResult, status) => {
                  console.log(placeResult.name);
              });       
              console.log(results[1].formatted_address);
            }
          } 
        });


      console.log('socket test'); 
      this.markers.push(pos);
      console.log('socket testing');
      this.markerService.getMarkers();
      //this.markerService.addMarker(pos);

        console.log('socket worked'); 
        let circle = new google.maps.Circle({
          clickable: false,
          center: pos,
          radius: this.radius,
          map: this.map
        });
      
        var bounds = circle.getBounds();
        console.log("circle bounds = " + bounds);
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          this.zone.run(() => {
          let updatelocation = {
            lat: data.coords.latitude,
            lng: data.coords.longitude
          }; 
          if(!bounds.contains(updatelocation)){
            this.deleteMarkers(pos);
            this.markerService.removeMarker(pos);
            this.allowPinDrop = false;  
            console.log('marker removed');
          }
          });  
        });  
        
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Cannot Drop Multiple Pins',
        subTitle: 'You already dropped a pin at your current location',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  
  convertStringToNumber(value: string): number {
    return +value;
  }

  setMapOnAll(map) {
    for(var i = 0; i < this.markers; i++) {
     // this.markers[i] = google.maps.setMap(map);
     this.markers[i] = null;
    }
    this.markers = [];
  } 

  clearMarkers(){
    this.setMapOnAll(null);
  } 

  deleteMarkers(marker) {
    this.markerService.removeMarker;
    this.clearMarkers();
    this.markers = [];
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let toast = this.toastCtrl.create({
      message: 'Welcome to Lagos! <br /><br /> Search for your favourite spots to gauge the current vibes there',
      position: 'middle',
      showCloseButton: true,
      cssClass: "toast-map"
    });

    toast.present();
    this.lat = 6.4471;
    this.lng = 3.4182;
    this.zoom = 15;
    localStorage.clear();
    this.markerService.getMarkers();
 /*   this._socketService.on('marker-added', (marker:any) => {
      localStorage.setItem('markers', marker);
      this.markers.push(marker);   
    });
*/
    this.searchControl = new FormControl();

    //load Google Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          bounds: {
          east:  3.696728,
          north: 6.702798,
          south: 6.393351,
          west: 3.098273
      },
        types: ["establishment"]
      });


      autocomplete.addListener("place_changed", () => {
        this.zone.run(() => {
          //get the place result
        
          //var searcher = google.maps.place.searchElementRef
          // Bind the map's bounds (viewport) property to the autocomplete object,
          // so that the autocomplete requests use the current map bounds for the
          // bounds option in the request.
          //autocomplete.bindTo('bounds', map);
          var place =  google.maps.places.PlaceResult = autocomplete.getPlace();
        
          //var boundsByViewport = place.geometry.viewport;
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
        
          this.zoom = 19;
        });
      });
    }); 
    //let latLng = new google.maps.LatLng(6.4471,3.4182);  
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
}

//Marker Type
interface marker {
  lat: number;
  lng: number;  
  placeID: string;
  place
  zoom: number;
  userName?: string;
}




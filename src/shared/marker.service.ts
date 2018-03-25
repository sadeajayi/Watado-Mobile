import { Injectable } from '@angular/core';
//import { environment } from '../environments/environment';
//import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
//import { AngularFireDatabase } from 'angularfire2/database';
import * as GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import {Init} from "../init-markers";


@Injectable()
export class MarkerService {
  //public markers: FirebaseListObservable<any[]>;
  dbRef: AngularFireList<any>;
  items: Observable<any[]>;
  geoFire: any;
  hits = new BehaviorSubject([])
  constructor(
    private db: AngularFireDatabase
  ) {

   // super();
    console.log("Marker Service Initialized ")
   // this.load();
  }

  getMarkers(){

  //  this.markers = this.db.list('/marker');
  //  console.log("Marker Service Initialized "+ this.markers);
   this.dbRef  =  this.db.list('/marker');
    return this.dbRef.snapshotChanges()
    .map(changes => {
      
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}));
    });
    //return this.db.list('/marker');

  }

  addMarker(newMarker){
    //fetch markers that are already there
   //  var markers = JSON.parse(localStorage.getItem('markers'));

    // Push to array
    //markers.push(newMarker);

    //set markers again
    //localStorage.setItem('markers',JSON.stringify(markers));
    let marker = {
      lat: newMarker.lat,
      lng: newMarker.lng,
      userName: newMarker.userName
    }
    return this.db.list('/marker').push(marker);
  }

  updateMarker(marker, newLat, newLng){
    var markers = JSON.parse(localStorage.getItem('marker'));

    for(let i = 0; i < markers.length; i++){
      if(marker.lat == markers[i].lat && marker.lng == markers[i].lng){
        markers[i].lat = newLat;
        markers[i].lng = newLng;
      }
    }
    //set markers again
    localStorage.setItem('markers',JSON.stringify(markers))

  }

  removeMarker(marker){
    //var markers = JSON.parse(localStorage.getItem('markers'));

  /*  for(let i = 0; i < markers.length; i++){
      if(marker.lat == markers[i].lat && marker.lng == markers[i].lng){
        markers.splice(i, 1)
      }
    }
    */
    //set markers again
   // localStorage.setItem('markers',JSON.stringify(markers))
   let key = marker.key;
    return this.db.object('/marker/marker' + key).remove();
  }
  
}
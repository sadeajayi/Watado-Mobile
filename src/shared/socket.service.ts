import { Injectable } from '@angular/core';
//import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { Socket } from 'ng-socket-io';
import * as io from 'socket.io-client';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SocketService {
//socket: SocketIOClient.Socket;
markers: any;
  constructor(public http: Http, private socket: Socket) {
   
   this.socket.connect();
   console.log("sockettt port: ", this.socket.connect());
    //this.socket = io.connect();
  }

  on(eventName: any, callback: any) {
      if (this.socket) {
        this.socket.on(eventName, function(data: any) {
          callback(data);
        });
        console.log('markers here');
       // var markers = localStorage.getItem('markers');
       // markers += this.socket;
      }

  };

  emit(eventName: any, data: any) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      // localStorage.setItem('markers', this.markers);
        console.log('markers emited');
      }
  };

  removeListener(eventName: any) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
  };

}
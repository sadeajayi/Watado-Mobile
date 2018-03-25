import { Injectable, EventEmitter, Inject } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from "rxjs/Observable";
import { Platform, ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook'; //Added Facebook
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { NativeStorage } from '@ionic-native/native-storage';
import * as firebase from 'firebase/app'; //Changed firebase/app

@Injectable()
export class AuthProvider {
    userDat: any;
    userData = {
        loggedIn: false,
        name: '',
        email: '',
        profilePic: ''
    }
constructor
(
    private af: AngularFireAuth, 
    private fb: Facebook, 
    private googlePlus: GooglePlus,
    private platform: Platform,
    private db: AngularFireDatabase,
    private nativeStorage: NativeStorage,
    private toast: ToastController

) {
} //Added injectors
 
loginWithFacebook() {
    return Observable.create(observer => {
        if (this.platform.is('cordova')) {
            return this.fb.login(['email', 'public_profile']).then(res =>  {
                this.fb.api('me?fields=id,name,email,first_name,picture.width(200).height(200).as(picture_small)', []).then(profile => {
                    this.userDat = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
                }); 
            const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
            this.af.app.auth().signInWithCredential(facebookCredential).then(() =>{
            observer.next();
            }).catch(error => {
            observer.error(error);
            });
        });
        } else {
            return this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res =>{
            this.userData.loggedIn = true,
            this.userData.email = res.user.email,
            this.userData.name = res.user.displayName,
            this.userData.profilePic = res.user.photoUrl
            observer.next();
            }).catch(error => {
            observer.error(error);
            });
        }
    });
}
 
loginWithGmail(){
    return Observable.create(observer => {
        if (this.platform.is('cordova')) {
            return this.googlePlus.login(['email', 'public_profile']).then(res =>  {
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.authResponse.accessToken);
            this.af.app.auth().signInWithCredential(googleCredential).then(() =>{
            observer.next();
            }).catch(error => {
            observer.error(error);
            });
        });
        } else {
            return this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
                this.userData.loggedIn = true,
                this.userData.email = res.user.email,
                this.userData.name = res.user.displayName,
                this.userData.profilePic = res.user.photoUrl
                observer.next();
            }).catch(error => {
            observer.error(error);
            });
        }
    }); 
}

 loginWithEmail(email: string, password: string) {
    return Observable.create(observer => {
        this.af.auth.signInWithEmailAndPassword(email, password
        ).then((authData) => {
            observer.next(authData);
            }).catch((error) => {
            observer.error(error);
            });
    });
} 
 
registerUser(email: string, password: string) {
    return Observable.create(observer => {
    
    this.af.auth.createUserWithEmailAndPassword(email, password)
    .then(authData => {
    //authData.auth.updateProfile({displayName: credentials.displayName, photoURL: credentials.photoUrl}); //set name and photo
    observer.next(authData);
    }).catch(error => {
            observer.error(error);
        });
    });
}
 
 resetPassword(emailAddress:string){
    return Observable.create(observer => {
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function(success) {
        //console.log('email sent', success);
        observer.next(success);
        }, function(error) {
        //console.log('error sending email',error);
        observer.error(error);
        });
    });
  } 
 
    logout() {
        this.af.auth.signOut();
        this.af.auth.currentUser = null;
    }
 
    get currentUser(){
/*         this.af.authState.subscribe(data => {
            this.toast.create({
                message: `Welcome to Lagos, ${data.displayName}`
            })
        }); */
        return this.af.auth.currentUser;
    }
}

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
//import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyBj5sZVlEXptG3DkRDF6Wj2EDPl_uRqCdc",
  authDomain: "smackchat-6287c.firebaseapp.com",
  databaseURL: "https://smackchat-6287c.firebaseio.com",
  projectId: "smackchat-6287c",
  storageBucket: "smackchat-6287c.appspot.com",
  messagingSenderId: "215997323892",
  appId: "1:215997323892:web:dd204a72ef0b3539104f21"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()

export {
  firebaseAuth, firebaseDb
}
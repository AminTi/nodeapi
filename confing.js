const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyAQKR7RidlZGqh2gEPEk_Wc12msQ5dZ99I",
  authDomain: "nodeapibytiti.firebaseapp.com",
  projectId: "nodeapibytiti",
  storageBucket: "nodeapibytiti.appspot.com",
  messagingSenderId: "246495846377",
  appId: "1:246495846377:web:b39395ed3c06d1c437b578",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("Users");
module.exports = User;

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init
const firebaseConfig = {
    apiKey: "AIzaSyCuqANYrpBD8y3fe9U1A2MLotR6XOoC7d4",
    authDomain: "smart-angklung.firebaseapp.com",
    projectId: "smart-angklung",
    storageBucket: "smart-angklung.appspot.com",
    messagingSenderId: "102146960984",
    appId: "1:102146960984:web:8761381e8998ead971e42d",
    measurementId: "G-MHKC2TPPBX"
  };
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

// collection references
// const usersCollection = db.collection('users')
// const postsCollection = db.collection('posts')
// const commentsCollection = db.collection('comments')
// const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  storage,
};
const fb_firebase = require("firebase/app");
const fb_storage = require("firebase/storage");
const config = require('../../constants/config');

const app = fb_firebase.initializeApp(config.firebaseConfig);
const storage = fb_storage.getStorage(app);

const admin = require("firebase-admin");

const serviceAccount = require("../../../m1-android-site-touristique-firebase-adminsdk-yfxee-4e4056e2a5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = { app, storage, fb_storage, admin };
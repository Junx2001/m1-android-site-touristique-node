const fb_firebase = require("firebase/app");
const fb_storage = require("firebase/storage");
const config = require('../../constants/config');

const app = fb_firebase.initializeApp(config.firebaseConfig);
const storage = fb_storage.getStorage(app);
const analytics = fb_storage.getAnalytics(app);

module.exports = { app, storage, fb_storage, analytics };
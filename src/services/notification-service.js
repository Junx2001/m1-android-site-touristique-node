const mongoo = require("mongoose");
const Notification = require("../routes/notifications/notification.model");

const fb_service = require('./firebase/firebase-service');

const storeAndSendLoginNotification = async (registrationToken, user) => {
    //Store Notification In Mongo Database 
    const newNotif = new Notification({
        _id:    new mongoo.Types.ObjectId(),
        title:  "Site Touristique - Login Notification",
        content:    `Hello ${user.name}, You've logged in Successfully`,
        user:   user._id,
      });
    var savedNotif = null;
      try {
        savedNotif = await newNotif.save();
        console.log("New Notification has been saved "+savedNotif);
      } catch (err) {
        console.log("Error saving notification "+err);
        return false;
      }
    //Store Notification In Mongo Database 

    const message = {
        notification: {
          title: "Site Touristique - Login Notification",
          body: `Hello ${user.name}, You've logged in Successfully`,
        },
        data:{
          created_at: String(savedNotif.created_at),
          notification_id: savedNotif._id.toString()
        },
        token: registrationToken,
        android: {
          priority: "high", // Set high priority for Android
        },
        apns: {
          headers: {
            "apns-priority": "10", // Set APNs priority to 10
          },
          payload: {
            aps: {
              sound: "default",
            },
          },
        },
      };
      
    //Send Push Notification of Login to User Logged In
    fb_service.admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent notification:', response);
            return true;
        })
        .catch((error) => {
            console.error('Error sending notification:', error);
            return false;
        });
    //Send Push Notification of Login to User Logged In
}

module.exports = {
    storeAndSendLoginNotification
};
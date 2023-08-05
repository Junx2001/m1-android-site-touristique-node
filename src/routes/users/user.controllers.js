const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoo = require("mongoose");

const User = require("./user.model");
const notification_service = require('../../services/notification-service');


const userRegister = async (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(async (user) => {
      if (user.length >= 1) {
        res.status(409).json({
          message: "Email Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoo.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              name: req.body.name,
            });
            user
              .save()
              .then(async (result) => {
                await result
                  .save()
                  .then(async (result1) => {
                    console.log(
                      `User created ${result}, your account has been activated`
                    );

                    res.status(201).json({
						message: "The New User has successfully been registered",
                      userDetails: {
                        userId: result._id,
                        email: result.email,
                        name: result.name,
                        active: result.active,
                      },
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                      message: err.toString(),
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  message: err.toString(),
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    });
};

const userLogin = (req, res, next) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed: Email not found probably",
        });
      }
      if (user[0].active != 1) {
        return res.status(401).json({
          message: "Auth failed: Please Verify your account, it might be blocked",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
		console.log(err);
        if (err) {
          console.log(err);
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user[0]._id,
              email: user[0].email,
              name: user[0].name,
            },
            process.env.jwtSecret,
            {}
          );
          console.log(user[0]);

          // Registration Token Used to Notify User using Firebase Custom Notification
          const registrationToken = req.headers['registration-token'];
          if(registrationToken){
            User.findByIdAndUpdate(user[0]._id, { registration_token: registrationToken }, { new: true })
            .then(updatedUser => {
                console.log('User\'s registration token updated:', updatedUser);
            })
            .catch(error => {
              console.error('Error updating user registration token:', error);
            });
          }
          // Registration Token Used to Notify User using Firebase Custom Notification

          //Store Notification of Login and Send Push Notification to User Logged In
          try {
            notification_service.storeAndSendLoginNotification(registrationToken, user[0]);
          } catch (error) {
            console.log("ERROR with Storing and Pushing Login Notification ",error);
          }
          //Store Notification of Login and Send Push Notification to User Logged In

          return res.status(200).json({
            message: "Auth successful",
            userDetails: {
              userId: user[0]._id,
              name: user[0].name,
              email: user[0].email,
            },
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed1, credentials invalid",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const getMe = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (user) {
    res.status(200).json({
      message: "User Found",
      user,
    });
  } else {
    res.status(400).json({
      message: "Bad request",
    });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const new_name = req.body.name;
  User.findByIdAndUpdate(userId, { name: new_name }, { new: true })
  .then(updatedUser => {
      console.log('User\'s profile has been updated:', updatedUser);
      res.status(200).json({
        message: "User\'s profile has been updated",
        user: updatedUser,
      });
  })
  .catch(error => {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      message: error,
    });
  });

};


module.exports = {
  userLogin,
  userRegister,
  getMe,
  updateUserProfile
};

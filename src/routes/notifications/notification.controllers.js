const Notification = require("./notification.model");

const getAllMyNotifs = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query parameter or default to 1
  const perPage = parseInt(req.query.perPage) || 10; // Number of documents per page (default: 10)
  const userId = req.user.userId;

  Notification.paginate({ user: userId }, { page, limit: perPage, populate: 'user' })
    .then((result) => {
      res.status(200).json({
        message: "Notification for User "+req.user.name+" Fetched Successfully",
        currentPage: result.page,
        totalPages: result.totalPages,
        datas: result.docs,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error.toString(),
      });
    });

};

const getNotifDetail = async (req, res) => {

  await Notification.findOne({ _id: req.params.notificationId}).populate({
		path: 'user',
	  }).exec()
		.then( async (result) => {
      if(!result){
        return res.status(404).json({
          message: 'Notification not found'
        });
      }

			res.status(200).json({
        message: "Notification with Object Id "+req.params.notificationId+" has been found",
				data : result
        });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				message: error.toString()
			  })
		});
};


const readNotif = async (req, res) => {
  try {
    // Fetch the notification from the database to verify the conditions
    const notification = await Notification.findById(req.params.notificationId);

    // Check if the notification exists
    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found'
      });
    }

    if(req.user.userId != notification.user._id){
      return res.status(401).json({
        message: "You are not authorized to read that notification ressource"
        });
    }

    // If verification passes, update the notification
    const updatedNotif = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read_at: new Date() },
      { new: true }
    );

    res.status(200).json({
      message: `Notification with Object Id ${req.params.notificationId} has been read by ${req.user.name}`,
      data: updatedNotif
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.toString()
    });
  }
};


module.exports = {
  getAllMyNotifs,
  getNotifDetail,
  readNotif
};

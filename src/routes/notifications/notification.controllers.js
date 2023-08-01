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


module.exports = {
  getAllMyNotifs,
  getNotifDetail,
};

const Site = require("./site.model");

const getSites = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the page number from query parameter or default to 1
  const perPage = parseInt(req.query.perPage) || 10; // Number of documents per page (default: 10)
  const nameQuery = req.query.name || ''; // Get the name search query parameter or default to an empty string

  const query = nameQuery ? { name: { $regex: nameQuery, $options: 'i' } } : {};

  Site.paginate(query, { page, limit: perPage, populate: 'region' })
    .then((result) => {
      res.status(200).json({
        message: "Tourist Sites Fetched Successfully",
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

const getSiteDetail = async (req, res) => {

  await Site.findOne({ _id: req.params.siteId}).populate({
		path: 'region',
	  }).exec()
		.then( async (result) => {

			res.status(200).json({
        message: "Tourist Site with Object Id "+req.params.siteId+" has been found",
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

const getSitesGroupedByRegion = async (req, res) => {
  Site.aggregate([
    {
      $group: {
        _id: '$region',
        sites: { $push: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'regions', // Assuming the collection name for regions is 'regions'
        localField: '_id',
        foreignField: '_id',
        as: 'regionDetails'
      }
    },
    {
      $project: {
        region: {
          _id: '$_id',
          name: { $arrayElemAt: ['$regionDetails.name', 0] } // Assuming 'name' is the field in the regions collection
        },
        sites: 1
      }
    }
  ])
  .exec()
  .then((groupedSites) => {
    res.status(200).json({
      message: "Tourist Sites Grouped by Region Fetched Successfully",
      data: groupedSites,
    });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({
      message: error.toString(),
    });
  });
  
};

module.exports = {
  getSites,
  getSiteDetail,
  getSitesGroupedByRegion
};

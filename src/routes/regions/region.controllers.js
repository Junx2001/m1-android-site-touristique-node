const Region = require('./region.model');

const getAllRegions = async (req, res) => {
  
    await Region.find().exec()
      .then((result) => {
  
        console.log(result);
        res.status(200).json({
          message: "Region Fetched Successfully",
          datas: result
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
  getAllRegions
};
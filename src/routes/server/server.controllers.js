
const getHealth = async (req, res) => {
    return res.status(200).json({
      message: "Server is alive, don't worry my friend :)",
    });
};

module.exports = {
  getHealth,
};

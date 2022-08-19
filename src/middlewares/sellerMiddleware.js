const jwt = require("jsonwebtoken");

const sellerMid = async function (req, res, next) {
  try {
    //Authentication
    const bearerHeader = req.header('Authorization', 'Bearer')
    if (!bearerHeader) {
      return res
        .status(404)
        .send({ status: false, message: "token must be present" });
    }

        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
  //Authorization
    var decodedToken = jwt.verify(token, "product-app");

    if(!decodedToken){
      res.status(400).send({status:false, message:"Invalid token"})
    }


    req.sellerId = decodedToken.sellerId;

    next();

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { sellerMid };
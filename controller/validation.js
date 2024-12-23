const userdetailsmodel = require("../models/userdetailsmodel");

const jwt = require("jsonwebtoken");
const validation = async (req, res) => {
  try {
    const { token } = req.body;
    // console.log("validation", req.body.useridtotalk);
    let checkavailable=false
    if (req.body.useridtotalk) {
      // console.log("inside");

       checkavailable = await userdetailsmodel
        .findOne({ _id: req.body.useridtotalk })
        .select("-password");
      // console.log(">>", checkavailable);
    }
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );
    // console.log(decoded);
    const checkEmail = await userdetailsmodel
      .findOne({ _id: decoded.id })
      .select("-password");
    // console.log(checkEmail);
    return res.status(200).json({
      data: checkEmail,
      useridtotalk:checkavailable,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      data: error,
      success: false,
    });
  }
};

module.exports = validation;

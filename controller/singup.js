const userdetailsmodel = require("../models/userdetailsmodel");
const bcrypt = require("bcrypt");

const singup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("singup", req.body);
    const checkEmail = await userdetailsmodel.findOne({
      $or: [{ username }, { email }],
    });
console.log(checkEmail);

    if (checkEmail) {
      return res.json({
        message: 98980,
        data: checkEmail,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const payload = { username, email, password: hashpassword };
    const user = new userdetailsmodel(payload);
    const result = await user.save();
    // console.log(">>", result);
    return res.json({
      message: 98981,
      data: result,
      success: true,
    });
  } catch (error) {
    // console.log("error >>", error);
    return res.json({
      message: 52,
      success: false,
      data: error,
    });
  }
};

module.exports = singup;

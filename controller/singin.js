const userdetailsmodel = require("../models/userdetailsmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const singin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("singin", req.body);
    const checkEmail = await userdetailsmodel.findOne({ email });
    console.log(checkEmail);

    if (!checkEmail) {
      console.log("here", checkEmail);
      return res.json({
        message: 98980,
        data: checkEmail,
        success: false,
      });
      //   return res.status(400).json({
      //     message: 98980,
      //     data: checkEmail,
      //     success: false,
      //   });
    } else {
      const comparepassword = await bcrypt.compare(
        password,
        checkEmail.password
      );
      if (comparepassword == true) {
        const token = await jwt.sign(
          {
            id: checkEmail._id,
          },
          process.env.SECRET_KEY
        );
        console.log(token);
        const cookieOptions = {
          http: true,
          secure: true,
        };

        return res.cookie("token", token, cookieOptions).json({
          message: 98981,
          data: checkEmail,
          success: true,
          token: token,
        });
      } else {
        return res.json({
          message: 98980,
          data: checkEmail,
          success: false,
        });
      }
    }
  } catch (error) {
    // console.log("error >>", error);
    return res.json({
      message: 52,
      success: false,
      data: error,
    });
  }
};

module.exports = singin;

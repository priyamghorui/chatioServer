const userdetailsmodel = require("../models/userdetailsmodel");

const jwt = require("jsonwebtoken");
const singout = async (req, res) => {
 
    const { token } = req.body;
    console.log("singout", req.body);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    return res.json({
        success:true
    })
    // const checkEmail = await userdetailsmodel.findOne({ email });
    // console.log(checkEmail);


};

module.exports = singout;

const userdetailsmodel = require("../models/userdetailsmodel");

const jwt = require("jsonwebtoken");
const setuserstatus = async (req, res) => {
  try {
    const { _id ,setstatus} = req.body;
    console.log("setuserstatus", req.body);
   
    const updatestatus = await userdetailsmodel.updateOne({_id},{$set:{onlinestatus:setstatus}})
    console.log(updatestatus);
    return res.status(200).json({
      data: updatestatus,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      data: error,
      success: false,
    });
  }
};

module.exports = setuserstatus;

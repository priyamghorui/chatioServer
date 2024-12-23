const userdetailsmodel = require("../models/userdetailsmodel");

const jwt = require("jsonwebtoken");
const {
  messageModel,
  conversetionModel,
} = require("../models/usermassagesmodel");
const availablechating = async (req, res) => {
  try {
    const { _id } = req.body;
    // console.log("availablechating", req.body);

    const available = await conversetionModel.find({
      $or: [{ user1: _id }, { user2: _id }],
    });

    // const sortuser1formmainuser=available.filter((e)=>{if (e.user1!=_id) {
    //   return e.user1
    // }})
    // const sortuser2formmainuser=available.filter((e)=>{if (e.user2!=_id) {
    //   return e.user2
    // }})
    // console.log("available",available);
    
    let sortuserformmainuser = [];
    available.forEach(async (e) => {
      if (e.user1 != _id) {
        sortuserformmainuser.push({ _id: e.user1, details: e.user1data });
      } else {
        sortuserformmainuser.push({ _id: e.user2, details: e.user2data });
      }
    });
    // console.log(sortuserformmainuser);

    return res.status(200).json({
      data: sortuserformmainuser,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      data: error,
      success: false,
    });
  }
};

module.exports = availablechating;

const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const userdetailsmodel = require("../models/userdetailsmodel");
const {
  messageModel,
  conversetionModel,
} = require("../models/usermassagesmodel");

const jwt = require("jsonwebtoken");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.PARENT_URL,
    credentials: true,
  },
});
const onlineUser = new Set();
io.on("connection", async (socket) => {
  console.log("connect User ", socket.id,socket.handshake.auth.friend);

  const token = socket.handshake.auth.token;
  const friend=socket.handshake.auth.friend
  // const useridtotalk = socket.handshake.auth.useridtotalk;
  const decoded = jwt.verify(
    token,
    process.env.SECRET_KEY
  );

  const checkEmail = await userdetailsmodel
    .findOne({ _id: decoded.id })
    .select("-password");
  const frienddata = await userdetailsmodel
    .findOne({
      _id: friend,
    })
    .select("-password");
  // console.log("now>>",checkEmail);
  
  socket.join(checkEmail?._id.toString());
  onlineUser.add(checkEmail?._id?.toString());
  // const available = await conversetionModel.find({
  //   $or: [{ user1: checkEmail._id }, { user2: checkEmail._id }],
  // });
  // console.log("ca>",available);

  // let sortuserformmainuser = [];
  // available.forEach(async (e) => {
  //   if (e.user1 != checkEmail._id.toString()) {
  //     console.log(onlineUser.has(e.user1.toString()));
  //     if (onlineUser.has(e.user1.toString())) {
  //       sortuserformmainuser.push({
  //         _id: e.user1,
  //         details: e.user1data,
  //         online: true,
  //       });
  //     } else {
  //       sortuserformmainuser.push({
  //         _id: e.user1,
  //         details: e.user1data,
  //         online: false,
  //       });
  //     }
  //   } else {
  //     // console.log(onlineUser.has(e.user2.toString()));
  //     if (onlineUser.has(e.user2.toString())) {
  //       sortuserformmainuser.push({
  //         _id: e.user2,
  //         details: e.user2data,
  //         online: true,
  //       });
  //     } else {
  //       sortuserformmainuser.push({
  //         _id: e.user2,
  //         details: e.user2data,
  //         online: false,
  //       });
  //     }
  //   }
  // });
  // console.log("88>>", sortuserformmainuser);
  io.emit("onlineUser", Array.from(onlineUser));
  // io.to(checkEmail._id.toString()).emit("onlineUserwithdata", sortuserformmainuser);

  // const payload={user1:checkEmail,user2:}
  // const conversationload = new userdetailsmodel(payload);

  // console.log(checkEmail);
  // console.log("]]>", useridtotalk);

  // console.log("==",massages);

  const previousmassages = await messageModel.find({
    $or: [
      { msgByUserId: checkEmail._id, msgtoId: friend },
      { msgByUserId: friend, msgtoId: checkEmail._id },
    ],
  }).sort({ updatedAt : 1 });
  // console.log("previousmassages>?",previousmassages[-1]);
  
  socket.emit("previousallmassage", [
    ...previousmassages,
    { mainuserid: checkEmail._id },
  ]);
  socket.emit("useridtotalkdetails", frienddata);
  socket.on("chatwithuserid", async (data) => {
    console.log("chatwithuserid",data);
    socket.emit("useridtotalkdetails", data.data);
    const previousmassages = await messageModel.find({
      $or: [
        { msgByUserId: checkEmail._id, msgtoId: data._id },
        { msgByUserId: data._id, msgtoId: checkEmail._id },
      ],
    }).sort({ updatedAt : 1 });
    socket.emit("previousallmassage", [
      ...previousmassages,
      { mainuserid: checkEmail._id },
    ]);
  });

  socket.on("sentmassages", async (massage) => {
    console.log("massage>>", massage);
    const otheruseriddata = await userdetailsmodel.findOne({
      _id: massage.otheruserid,
    });
    const payload1 = {
      user1: checkEmail._id,
      user1data: checkEmail,
      user2: massage.otheruserid,
      user2data: otheruseriddata,
    };
    const checkconversation = await conversetionModel.find({
      $or: [
        { user1: checkEmail._id, user2: massage.otheruserid },
        { user1: massage.otheruserid, user2: checkEmail._id },
      ],
    });
    if (checkconversation.length == 0) {
      // console.log("<>");
      const conversationadduser = new conversetionModel(payload1);
      const result1 = await conversationadduser.save();
      // console.log("result1>>",result1);
    }
    // console.log("checkconversation", checkconversation);

    const payload = {
      text: massage.sentvalue,
      msgByUserId: massage.mainuserid,
      msgtoId: massage.otheruserid,
    };
    // const usercheck=await messageModel.findOne({msgByUserId: checkEmail._id})
    const newMassage = new messageModel(payload);
    const result = await newMassage.save();
    // const result = await messageModel.updateOne(
    //   { msgByUserId: massage.mainuserid },
    //   { $push: { text: massage.sentvalue } }
    // );
    // console.log("result>>", result);
    const massages = await messageModel.find({
      $or: [
        { msgByUserId: checkEmail._id, msgtoId: massage.otheruserid },
        { msgByUserId: massage.otheruserid, msgtoId: checkEmail._id },
      ],
    }).sort({ updatedAt : 1 });
    io.to(massage.otheruserid).emit("newmassage", [
      ...massages,
      { mainuserid: massage.otheruserid },
    ]);
    // console.log("massages", massages);

    io.to(checkEmail._id.toString()).emit("newmassage", [
      ...massages,
      { mainuserid: checkEmail._id.toString() },
    ]);
  });

  //disconnect
  socket.on("disconnect", async () => {
    console.log("disconnect user ", socket.id);
    onlineUser.delete(checkEmail?._id?.toString());
    io.emit("onlineUser", Array.from(onlineUser));
  });
});

module.exports = { app, server };

const express =require("express")
const singup = require("../controller/singup")
const singin = require("../controller/singin")
const singout = require("../controller/singout")
const validation = require("../controller/validation")
const searchuser = require("../controller/searchuser")
const availablechating = require("../controller/availablechating")
const setuserstatus = require("../controller/setuserstatus")


const router=express.Router()

router.post("/singup",singup)
router.post("/singin",singin)
router.post("/singout",singout)
router.post("/validation",validation)
router.post("/searchuser",searchuser)
router.post("/availablechating",availablechating)
router.post("/setuserstatus",setuserstatus)









module.exports=router
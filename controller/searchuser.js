const userdetailsmodel = require("../models/userdetailsmodel");

const jwt = require("jsonwebtoken");
const searchuser = async (req, res) => {
 
    try {
        const { search,mainuserId } = req.body;
        console.log("searchuser", req.body);
        const query = new RegExp(search,"i")
        // console.log(query);
        
        const user = await userdetailsmodel.find({
            "$or" : [
                { username : query },
                // { email : query }
            ]
        }).select("-password")
        // console.log(user);
        const updatedData=user.filter((e)=>{return e._id!=mainuserId})
        // console.log("update",updatedData);
        
        return res.status(200).json({
            data: updatedData,
            success: true,
          });
        
    } catch (error) {
        console.log("reeserver***");
        
        return res.status(400).json({
            data: error,
            success: false,
          });
    }
};

module.exports = searchuser;

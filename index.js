const express = require("express");
const cors = require("cors");
const router = require("./routes");
const connectdb = require("./connection/connectdb");
const bodyParser = require("body-parser");
const {app,server} =require("./socket/index")
// const app = express();
app.use(
  cors({
    origin: process.env.PARENT_URL,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  console.log("he");
  
  res.send("hello");
});
app.use(express.json());
app.use("/api", router);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

connectdb().then(() => {
  server.listen(process.env.PORT, () => {
    console.log("connected...");
  });
});

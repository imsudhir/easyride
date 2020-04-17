const { 
      createcustomer,
      login,
      verify,
      searchDriver,
      resendOtp,
      updatecustomers,
  } = require("./customer.controller");
  
const router = require("express").Router();
const multer=require('multer')
const upload =multer({dest:'./uploads'})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
router.post("/", createcustomer);
router.post("/login", login);
router.get("/verify", verify);
router.post("/resendOtp", resendOtp);
router.patch("/searchDriver", searchDriver);
module.exports = router; 

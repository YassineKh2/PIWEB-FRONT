const express = require("express");
const router = express.Router();
const {signup,
     getAllUsers,
     updateUser,
     deleteUser,
     signin,
     addAdmin,
     blockUser,
     unBlockUser,
     getUserProfile,
     getuser,
     addTRM,
     addTM
    } = require("../controllers/userController");
const {userValidator} = require("../middlewares/validators");


router.get("/getall", getAllUsers);
router.post("/signup", userValidator, signup);
router.put("/update/:id", userValidator, updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/signin",signin);
router.post("/addAdmin",addAdmin);
router.patch("/block/:id", blockUser);
router.patch("/unblock/:id", unBlockUser);
router.get('/profile', getUserProfile);
router.get("/getuser/:id",getuser);
router.post("/addTRM",addTRM);
router.post("/addTM",addTM);
module.exports = router;

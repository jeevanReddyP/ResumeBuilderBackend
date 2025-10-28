const express = require('express')
const router=express.Router()
const userController=require("../controllers/userController")

router.post("/signin",userController.RegisterUser)
router.post("/login",userController.loginUser)
router.get("/:id",userController.getUser)

module.exports=router





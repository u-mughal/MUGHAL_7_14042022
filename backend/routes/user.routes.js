// Importations
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const authController = require('../controllers/auth.controller');

// Les routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/register", authController.signUp);



module.exports = router;
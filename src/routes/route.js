const express = require('express');
const path = require("path");


const router = express.Router();
// express routing
router.use(express.static(path.join(__dirname, "../public")));
router.use(express.static(path.join(__dirname, "../controllers")));
router.use(express.static(path.join(__dirname, "../views")));
router.use(express.static(path.join(__dirname, "../views/login")));



module.exports = router;
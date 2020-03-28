const express = require("express");
const router = express.Router();
const optionService = require("../services/optionService");

router.get("/all", (req, res) => {
	optionService.all(req, res);
});


module.exports = router;

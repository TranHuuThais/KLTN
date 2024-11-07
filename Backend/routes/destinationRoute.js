const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createDestination,
  deleteDestination,
  editDestination,
  getAllDestination,
} = require("../controller/destination");


router.post("/create", upload, createDestination);
router.delete("/:id", deleteDestination);
router.put("/:id", upload, editDestination);
router.get("/", getAllDestination);

module.exports = router;
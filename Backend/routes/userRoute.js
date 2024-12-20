const express = require("express");
const router = express.Router();
const {
  register,
  login,
  deleteUser,
  // editUser,
  updateUser,
  getAllUser,
  getUserById,
  searchUser,
  getUserGuideId,
  getUserCount,
  getTourGuideCount,
} = require("../controller/user");

router.post("/register", register);
router.post("/login", login);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);
// router.put("/:id", editUser);
router.get("/", getAllUser);
router.get("/userGuideId/:id", getUserGuideId);
router.post("/:id", getUserById);
router.get("/search", searchUser);
router.get("/user-count", getUserCount);
router.get("/tourGuideCount", getTourGuideCount);

module.exports = router;

var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../db-models/user");

router.post("/", async (req, res) => {
  try {
    const { username, surName, firstName, middleName, password } = req.body;
    const findUsers = await User.find();

    if (findUsers.length) {
      const currentUser = await User.findOne({ username });

      if (currentUser) {
        return res.status(409).json({
          message: "This user already exists",
        });
      }
    }

    const permission = {
      chat: { C: true, R: true, U: true, D: true },
      news: { C: true, R: true, U: true, D: true },
      settings: { C: true, R: true, U: true, D: true }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      surName,
      firstName,
      middleName,
      permission,
      password: hashedPassword
    });

    await user.save();

    user.id = user._id;

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err || "Something went wrong",
    });
  }
});

module.exports = router;

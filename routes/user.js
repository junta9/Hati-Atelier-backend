const express = require("express");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const { getToken, checkToken } = require("../middlewares/jwt");

const router = express.Router();
const UserModel = mongoose.model("User");

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  let hashPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    username,
    password: hashPassword,
  });

  if (user) {
    res.json({
        message: "User created successfully",
    });
  } else {
    res.json("error");
  }
});

// - `GET /:id`: Récupère un élément spécifique par ID.
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    res.status(401).json("Username or Password does not match");
  } else {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json("Username or Password does not match");
    } else {
      const token = getToken(user);
      res.json({
        token,
      });
    }
  }
});

router.get("/me", checkToken, async (req, res) => {
  if (req.decoded) {
    const user = await UserModel.findById(req.decoded._id);
    res.json(user);
  } else {
    throw new Error("Unexpected Error");
  }
});


module.exports = router;



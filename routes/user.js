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


// {
//     "title": "Le Nom du Vent",
//     "author": "Patrick Rothfuss",
//     "pages": 662,
//     "genre": "Fantasy",
//     "published": true,
//     "userId": "6527a61daabe3673c256b7e6"
//   }

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI3YTYxZGFhYmUzNjczYzI1NmI3ZTYiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjk3MTAxNjMzLCJleHAiOjE2OTc3MDY0MzN9.NYwnEtMAliT-kgubargx_gDGYQZMGaQLsD-erCy3_YA

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI3YTYxZGFhYmUzNjczYzI1NmI3ZTYiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjk3MTAzOTMxLCJleHAiOjE2OTc3MDg3MzF9.7NEBe_Im5UO3RC5R6JjCIa6Je_tclRIt2UKP2wv5Pj0


//user:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI3YzkxOGVmODFlNzdmZmZiYWVmMmUiLCJ1c2VybmFtZSI6ImNob3UiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NzEwOTE5NSwiZXhwIjoxNjk3NzEzOTk1fQ.xTi-yFKOtILkLso-o8iJ2cgbNl3GavNoTmVoFBgJNbU

//admin:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI3YTYxZGFhYmUzNjczYzI1NmI3ZTYiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk3MTEwMTE2LCJleHAiOjE2OTc3MTQ5MTZ9.ukJX5Akvztnt6KUPIc1rEiS11wNv8XT29Oxz9HgwXpU
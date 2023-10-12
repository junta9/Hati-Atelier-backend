const express = require("express");
const { default: mongoose } = require("mongoose");
const { checkToken } = require("../middlewares/jwt");

const router = express.Router();
const BookModel = mongoose.model("Book");
router.use(checkToken);

// POST /books pour ajouter un nouveau livre (admin seulement).
router.post("/", checkToken, async (req, res) => {
  const body = req.body;
  // console.log(req.decoded.role);
  if (req.decoded.role === "admin") {
    const book = await BookModel.create(body);
    res.json({
      message: "Book created successfully",});
  } else
    res.json({
      message: "Vous devez etre administrateur",
    });
});

// GET /books pour récupérer tous les livres (utilisateurs authentifiés).
router.get("/", checkToken, async (req, res) => {
  if (req.decoded.role === "user" || req.decoded.role === "admin") {
    const books = await BookModel.find();
    res.json(books);
  } else
    res.json({
      message: "Vous devez etre utilisateur",
    });
});

// GET /books/:id pour récupérer un livre spécifique (utilisateurs authentifiés).
router.get("/:id", checkToken, async (req, res) => {
  if (req.decoded.role === "user" || req.decoded.role === "admin") {
    const book = await BookModel.findById(req.params.id);
    res.json(book);
  } else
    res.json({
      message: "Vous devez etre utilisateur",
    });
});

// DELETE /books/:id pour supprimer un livre (admin seulement).
router.delete("/:id", checkToken, async (req, res) => {
  if (req.decoded.role === "admin") {
    const book = await BookModel.findByIdAndDelete(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json({
      message: "Book deleted successfully",
    });
  } else
    res.json({
      message: "Vous devez etre utilisateur",
    });
});

module.exports = router;

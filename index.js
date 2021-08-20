const express = require("express");
const router = express.Router();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const User = require("./confing");
const { v4: uuidv4 } = require("uuid");

const PORT = "https://github.com/heroku/node-js-getting-started.git";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Api Library",
      version: "1.0.0",
    },
    servers: [{ url: port }],
  },
  apis: ["./index.js"], // files containing annotations as above
};

const specs = swaggerJsdoc(options);
const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(cors());

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - book
 *         - language
 *         -  year
 *       properties:
 *         book:
 *           type: string
 *           description: The book title
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         language:
 *           type: string
 *           description: The book language
 *         year:
 *           type: string
 *           description: The book year of expedition
 *       example:
 *         id: d5fE_asz
 *         book: Alkhemist
 *         language: francis
 *         year: "1996"
 */

/**
 * @swagger
 * tags:
 *   name: Book
 *   description: The books managing API
 */

// /**
//  * @swagger
//  * /create:
//  *   post:
//  *     summary: Create a book
//  *     tags: {Book}
//  *       requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *     responses:
//  *       201:
//  *         description:  book data
//  *         content:
//  *           application/json:
//  *             schema:
//  *                 items:
//  *                 $ref: '#/components/schemas/Book'
//  */

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new task
 *     tags: {Book}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Bad request
 */

app.post("/create", async (req, res) => {
  try {
    const data = {
      book: req.body.book,
      id: uuidv4(),
      language: req.body.language,
      year: req.body.year,
    };
    await User.add(data);
    return res.status(201).send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Failed 500" });
  }
});

app.get("/read", async (req, res) => {
  try {
    const snapshot = await User.get();
    let userData = [];
    snapshot.docs.map((doc) => {
      userData.push(doc.data());
    });
    return res.status(200).send(userData);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "failed" });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const snapshot = await User.get();
    const snap = await User.doc(req.params.id).get();
    let userId = snap.id;
    let userData = [];
    snapshot.docs.map((doc) => {
      userData.push(doc.data());
    });
    let dataItem = userData.filter((item) => {
      return item.id == userId;
    });
    return res.status(200).send(dataItem);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "failed" });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const data = {
      book: req.body.book,
      language: req.body.language,
      year: req.body.year,
    };
    const snap = await User.doc(req.params.id).get();
    let userId = snap.id;
    await User.doc(userId).update(data);
    return res.status(200).send("updated");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "failed" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const snap = await User.doc(req.params.id).get();
    let userId = snap.id;
    User.doc(userId).delete();
    return res.status(200).send("Deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "failed" });
  }
});

app.listen(PORT, () => console.log("Nodemon server port heroku"));

const express = require("express");
const router = express.Router();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const User = require("./confing");
const { v4: uuidv4 } = require("uuid");

// const PORT = process.env.PORT || 4000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Api Library",
      version: "1.0.0",
    },
    servers: [{ url: PORT }],
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
 *         book: Alkhemist
 *         id: "deMQuIvACuMfr7QyZUXShj"
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
//  *     tags: [Book]
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
 *     tags: [Book]
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

/**
 * @swagger
 * /read:
 *   get:
 *     summary: Create a new task
 *     tags: [Book]
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

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get the Book by id
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Book id
 *     responses:
 *       200:
 *         description: The task description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: The book was not found
 *
 * */

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
/**
 * @swagger
 * /update/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Book]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The Task was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      500:
 *        description: Some error happened
 */

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
/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Remove the Book by id
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was deleted
 *       500:
 *         description: The book was not found
 */

app.listen(PORT, () => console.log(`nodemon serve ${PORT}`));

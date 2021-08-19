const express = require("express");
const cors = require("cors");
const User = require("./confing");
const app = express();
app.use(express.json());
app.use(cors());
const { v4: uuidv4 } = require("uuid");

app.post("/create", async (req, res) => {
  try {
    const data = {
      book: req.body.book,
      id: uuidv4(),
      language: req.body.language,
      year: req.body.year,
    };
    await User.add(data);
    return res.status(201).send({ msg: "succes" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Failed" });
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

app.listen(4000, () => console.log("Nodemon server port 4000"));

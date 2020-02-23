const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const db = monk(
  // DATABASE URL
);

const item = db.get("item");

app.use(cors());
app.use(express.json());

// get requests

app.get("/", (req, res) => {
  res.json({
    message: "working!"
  });
});

//get item
app.get("/item", (req, res) => {
  item.find().then(item => {
    res.json(item);
  });
});
// validate post
function isValidItem(item) {
  return (
    item.name &&
    item.name.toString().trim() !== "" &&
    item.content &&
    item.content.toString().trim() !== ""
  );
}

// post requests
app.post("/item", (req, res, next) => {
  if (isValidItem(req.body)) {
    const dbItem = {
      name: req.body.name.toString(),
      content: req.body.content.toString(),
      created: new Date()
    };

    item
      .insert(dbItem)
      .then(createddbItem => {
        res.json(createddbItem);
      })
      .catch(next);
  } else {
    res.status(422);
    res.json({
      message: "name and or content not filled out."
    });
  }
});

app.delete("/item/:id", (req, res) => {
  const dbItem = {
    id: req.body.id
  };

  item.remove(dbItem.id).then(result => {
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("listening on http//localhost:3000");
});

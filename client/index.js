const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  client.getAll(null, (err, data) => {
    console.log(data);
    if (!err) {
      res.render("users", {
        results: data.users,
      });
    }
  });
});

app.post("/save", (req, res) => {
  let newUser = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.insert(newUser, (err, data) => {
    if (err) throw err;

    console.log("User created successfully", data);
    res.redirect("/");
  });
});

app.post("/update", (req, res) => {
  const updateUser = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.update(updateUser, (err, data) => {
    if (err) throw err;

    console.log("User updated successfully", data);
    res.redirect("/");
  });
});

app.post("/remove", (req, res) => {
  console.log(req.body);
  client.remove({ id: req.body.user_id }, (err, _) => {
    if (err) throw err;

    console.log("User removed successfully");
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
});

const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
let app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Delta_Class",
  password: "123456",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Count Route
app.get("/", (req, res) => {
  let q = "select count(*) from user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
  }
});

// Home route (display user )

app.get("/home", (req, res) => {
  let q = "select * from user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;

      res.render("show.ejs", { users });
    });
  } catch (err) {
    console.log(err);
  }
});
//edit route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select *from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
      console.log(result);
    });
  } catch (err) {
    console.log(err);
  }
});

//update (db)  route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `select *from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("wrong Password");
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`;

        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            res.redirect("/home");
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen("8080", (req, res) => {
  console.log("app is listining to 8080 port");
});

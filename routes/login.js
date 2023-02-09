const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
//JSOn web token 
const jwt = require("jsonwebtoken");
const db = admin.firestore();
bcrypt = require("bcryptjs");


// //Get all documents JSON
router.get("/", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

// //Get a document JSON
router.get("/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

//Login user
router.post("/", async (req, res) => {
  try {
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", req.body.email).get();
    if (snapshot.empty) {
      res.status(400).send({
        message: "User does not exist",
      });
    }
    snapshot.forEach((doc) => {
      const user = doc.data();
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      console.log(passwordIsValid);
      if (passwordIsValid !== false) {
        //Generate token
        const token = jwt.sign(
          {
            id: user.userId,
            email: user.email,
            username: user.username,
          },
          "secret",
          {
            expiresIn: "1h",
          }
        );

        //Set token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        //Set header
        res.header("x-access-token", token);

        res.status(200).send({
          message: "User logged in successfully",
          token: token,
        });
      } else {
        res.status(400).send({
          message: "Invalid password",
        });
      }
    });
  } catch (error) {
    res.send(error);
  }
});



//company user
router.post("/company", async (req, res) => {
  try {
    const companyRef = db.collection("companies");
    const {email, password} = req.body;
    const snapshot = await companyRef.where("email", "==", email).get();

    if (snapshot.empty) {
      res.status(400).send({
        message: "User does not exist",
      });
    }
    snapshot.forEach((doc) => {
      const company = doc.data();
      const passwordIsValid = bcrypt.compareSync(password, company.password);

      console.log(passwordIsValid);

      if (passwordIsValid !== false) {
        //Generate token
        const token = jwt.sign(
          {
            id: company.id,
            email: company.email,
          },
          "secret",
          {
            expiresIn: "1d",
          }
        );

        //Set token in cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        //Set header
        res.header("x-access-token", token);

        res.status(200).send({
          message: "Company logged in successfully",
          token: token,
        });
      } else {
        res.status(400).send({
          message: "Invalid password",
        });
      }
    });
  } catch (error) {
    res.send(error);
  }
});
//Check if user is logged in
router.post("/check", async (req, res) => {
  try {
    const token = req.cookies.token || req.headers["x-access-token"] || req.body.token;
    
    if (!token) {

      //Verify token
      jwt.verify(token, "secret", (err) => {
        if (err) {
          res.status(401).send({
            message: "User is not logged in",
            islogin: false,
          });
        }
      });
    } else {
      res.status(200).send({
        message: "User is logged in",
        islogin: true,
      });
    }
  } catch (error) {
    res.send
  }
});

module.exports = router;

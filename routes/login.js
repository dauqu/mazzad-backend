const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
//JSOn web token
const jwt = require("jsonwebtoken");
const SendMail = require("../functions/smtp");
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
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (passwordIsValid !== false) {
        //Generate token
        const token = jwt.sign(
          {
            id: user.userId,
            email: user.email,
            username: user.username,
          },
          "Harsh@Singh8576",
          {
            //Expire in a year
            expiresIn: 31556926,
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

//Check if user is logged in
router.post("/check", async (req, res) => {
  try {
    const token =
      req.cookies.token || req.headers["x-access-token"] || req.body.token;

    if (!token) {
      //Verify token
      jwt.verify(token, "Harsh@Singh8576", (err) => {
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
    res.send;
  }
});

// code to clear cookie and token from header and logout user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.header("x-access-token", null);
    res.json({ message: "Logout Success", status: "success" });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

// code to login with OTP and send OTP to user email and login user with token and cookie
router.post("/otp", async (req, res) => {
  // console.log(req.body);
  var otp = Math.floor(100000 + Math.random() * 900000);

  var html = `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">123 AUC</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Us . Use the following OTP to complete your Login procedures. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: auto;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />123 AUC</p>
      <hr style="border:none;border-top:1px solid #eee" />

    </div>
  </div>`;

  var subject = "OTP for Login";

  try {
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", req.body.email).get();

    if (snapshot.empty) {
      res.status(400).send({
        message: "User does not exist",
      });
    } else {
      // code to add otp to user profile
      snapshot.forEach((doc) => {
        const user = doc.data();
        const userRef = db.collection("users").doc(user.userId);
        userRef
          .update({
            otp: otp,
          })
          // if otp added then console log otp added
          .then(() => {
            console.log("OTP added");
          });
      });

      res.status(200).send({
        message: "OTP sent to your email",
        otp: otp,
      });

      SendMail(req.body.email, subject, html);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

// code to login user by getting otp from email id  and match the fetched otp with the input otp and login user with token and cookie
router.post("/otplogin", async (req, res) => {
  // code to get profile of user by email id
  console.log(req.body);
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

      // code to check if otp is valid or not
      if (req.body.otp == user.otp) {
        console.log("otp matched");

        //Generate token
        const token = jwt.sign(
          {
            id: user.userId,
            email: user.email,
            username: user.username,
          },
          process.env.JWT_SECRET,
          {
            //Expire in a year
            expiresIn: 31556926,
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

        // code to clear otp from user profile
        const userRef = db.collection("users").doc(user.userId);
        userRef

          .update({
            otp: "",
          })
          // if otp cleared then console log otp cleared
          .then(() => {
            console.log("OTP cleared");
          });
      } else {
        console.log("otp not matched");
        res.status(400).send({
          message: "Invalid OTP",
        });
      }
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

module.exports = router;

const { json } = require("express");
const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const SendMail = require("../functions/smtp");
const db = admin.firestore();





// code to find specific user in database and if user found then send email to that user with smtp
router.post("/notify", async (req, res) => {
  // console.log(req.body);

  // code to find user email in database and send email to that user
  const userRef = db.collection("users");
  const snapshot = await userRef.where("email", "==", req.body.email).get();
  if (snapshot.empty) {
    res.status(400).send({
      message: "User does not exist",
    });
  } else {
    var subject = req.body.subject;
    var body = req.body.body;
    var html = `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">123 AUC</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p style="font-size:1.1em">${subject} </p>
      <p>Thank you for choosing Us. Here are some important information for you.  </p>
      <p> ${body}  </p>
      <p style="font-size:0.9em;">Regards,<br />123 AUC</p>
      <hr style="border:none;border-top:1px solid #eee" />
    </div>
  </div>`;

    // code to send email to user
    SendMail(req.body.email, subject, html).catch(console.error);

    //  code to save email subject and body in database of user
    snapshot.forEach((doc) => {
      db.collection("users").doc(doc.id).update({
        Email_subject: subject,
        Email_body: body,
        Email_Send_Date: new Date(),
      });
    });

    res.status(200).send({
      message: "Email sent",
    });
  }
});

module.exports = router;

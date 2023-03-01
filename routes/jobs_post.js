const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const VerifyToken = require("../functions/verify-token");
// code to get all jobs from database
router.get("/", async (req, res) => {
  try {
    const db = admin.firestore();
    const jobsCollection = db.collection("jobs");
    const jobs = await jobsCollection.get();
    const jobsArray = [];
    jobs.forEach((doc) => {
      jobsArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(jobsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// with token verification and get job posted by user which have token
router.get("/myjobs", VerifyToken, async (req, res) => {
  //   console.log(req.body);

  VerifyToken(req, res);

  //   //Get token from header
  const token =
    req.body.token || req.cookies.token || req.headers["x-access-token"];
  //Return if no token
  if (!token) {
    res.status(401).send({
      message: "No token provided",
    });
  }
  //Check if no token
  const verified = VerifyToken(token);
  const username = verified.username;
  const email = verified.email;
  console.log(username, email);

  // code to get jobs from token email
  try {
    const db = admin.firestore();
    const jobsCollection = db.collection("jobs");
    const jobs = await jobsCollection.get();
    const jobsArray = [];
    jobs.forEach((doc) => {
      if (doc.data().creatorEmail === email) {
        jobsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });
    res.status(200).json(jobsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// code to verify token and get email and username from token and then post job to database with email and username
router.post("/", async (req, res) => {
  //   console.log(req.body);

  VerifyToken(req, res);

  //   //Get token from header
  const token =
    req.body.token || req.cookies.token || req.headers["x-access-token"];
  //Return if no token
  if (!token) {
    res.status(401).send({
      message: "No token provided",
    });
  }
  //Check if no token
  const verified = VerifyToken(token);
  const username = verified.username;
  const email = verified.email;
  //   console.log(username, email);

  try {
    // code to post job to database with email and username
    const db = admin.firestore();
    const jobsCollection = db.collection("jobs");

    const { title, description, location, salary, company, status } = req.body;
    const job = {
      title,
      description,
      location,
      salary,
      company,
      creatorEmail: email,
      creatorUsername: username,
      status: "vaccant",
      hiredPerson: "",
    };
    await jobsCollection.add(job);
    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //Get token from header
  //   try {
  //     const token =
  //       req.body.token || req.cookies.token || req.headers["x-access-token"];
  //     //Return if no token
  //     if (!token) {
  //       res.status(401).send({
  //         message: "No token provided",
  //       });
  //     }
  //     //Check if no token
  //     const verified = VerifyToken(token);
  //     const username = verified.username;
  //     const email = verified.email;

  //     console.log(username, email);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }

  //   try {
  //     const db = admin.firestore();
  //     const jobsCollection = db.collection("jobs");
  //     // get email and username from verified token

  //     const { title, description, location, salary, company, email, username } =
  //       req.body;
  //     const job = {
  //       title,
  //       description,
  //       location,
  //       salary,
  //       company,
  //       email: email,
  //       username: username,
  //     };
  //     await jobsCollection.add(job);
  //     res.status(201).json({ message: "Job added successfully" });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
});

// code to delete all job from database in single click
// router.delete("/", async (req, res) => {
//   try {
//     const db = admin.firestore();
//     const jobsCollection = db.collection("jobs");
//     const jobs = await jobsCollection.get();
//     const jobsArray = [];
//     jobs.forEach((doc) => {
//       jobsArray.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });
//     jobsArray.forEach(async (job) => {
//       await jobsCollection.doc(job.id).delete();
//     });
//     res.status(200).json({ message: "All jobs deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// code to delete post by id
// code to get job by id
router.get("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const jobsCollection = db.collection("jobs");
    const id = req.params.id;

    const job = await jobsCollection.doc(id).get();
    if (!job.exists) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.status(200).json({ id: job.id, ...job.data() });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// code to get job by creatoremail
router.get("/creator/:email", async (req, res) => {
  try {
    const db = admin.firestore();
    const jobsCollection = db.collection("jobs");
    const email = req.params.email;
    const jobs = await jobsCollection.where("creatorEmail", "==", email).get();
    const jobsArray = [];
    jobs.forEach((doc) => {
      jobsArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(jobsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const jobsCollection = db.collection("jobs");
    const id = req.params.id;
    await jobsCollection.doc(id).delete();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

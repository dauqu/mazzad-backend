const express = require("express");
const router = express.Router();
var fs = require("fs");
const slugify = require("slugify");


router.use(express.static(__dirname+"/"));

router.get("/", async (req, res) => {
  //Read dir and return JSON
  fs.readdir(__dirname+"/../storage", (err, files) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        files: files,
        files: files.map((file) => {
          return {
            name: file,
            url: `https://saudi.dauqu.host/storage/${file}`,
          };
        }),
      });
    }
  });
});

//Upload File
router.post("/", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: "error",
        message: "Error: No file uploaded",
      });
    } else {
      // Send File on Location
      const uploadedFile = req.files.uploadedFile;

      //File slug
      const slug = slugify(uploadedFile.name, {
        replacement: "-",
        remove: /[*+~()'"!:@]/g,
        lower: true,
      });

      //Save file to server
      uploadedFile.mv("./storage/" + slug);

      res.send({
        status: "success",
        message: "File successfully uploaded",
        file_name: `${req.protocol}://${req.get("host")}/storage/${
          slug
        }`,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "error.message" });
  }
});

module.exports = router;

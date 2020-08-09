const Express = require("express");
const { MongoClient } = require("mongodb");
const formidable = require("formidable");

// Mongo Database Mangement
const uri =
  "mongodb+srv://dbuser:dbuser@assignment1.uzdq3.mongodb.net/instagram?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

// Express Management
const app = new Express();

// Serve static page
app.use(Express.static("public"));

// Endpoint to Insert Image into database
app.get("/imageinsert", function (req, res) {
  let image = req.query.message;
  insertImage(image);
  res.send("Image Inserted");
});

// Endpoint to retrieve images from database
app.get("/images", function (req, res) {
  let images = retrieveImages(res);
});

// Endpoint to upload image to server
app.get("/imageupload", function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let oldpath = files.filetoupload.path;
    let newpath = `C:/Users/Your Name/${files.filetoupload.name}`;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    });
  });
});

let imageCollection;

const openConnection = (db) => {
  client.connect((err) => {
    if (err) throw err;
    imageCollection = client.db("instagram").collection("images");
  });
};

// Open database connection
openConnection();

const insertImage = (image, message) => {
  imageCollection.insert({ image: image, message: message });
};

/*
const retrieveImagesOLD = (res) => {
  var dbo = db.db("instagram");
  dbo
    .collection("images")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  let images = imageCollection.find().toArray(function (err, result) {
    if (err) throw err;
    res.send(result);
    // console.log(result);
  });
};
*/

const retrieveImages = (res) => {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("instagram");
    dbo
      .collection("images")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });
  });
};

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

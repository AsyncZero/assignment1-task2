const Express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");

// Mongo Database Mangement
const uri =
  "mongodb+srv://dbuser:dbuser@assignment1.uzdq3.mongodb.net/instagram?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

// Express Management
const app = new Express();

// Serve static page
app.use(Express.static("public"));

// Use Body Parse
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Endpoint to Insert Image into database
app.post("/imageinsert", function (req, res) {
  const image = req.body.image;
  const message = req.body.message;
  // console.log(image, message);
  insertImage(image, message);
  res.send("Image Inserted");
});

// Endpoint to retrieve images from database
app.get("/imageretrieve", function (req, res) {
  let images = retrieveImages(res);
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
  imageCollection.insertOne({ image: image, message: message });
};

const retrieveImages = (res) => {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    const dbo = db.db("instagram");
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

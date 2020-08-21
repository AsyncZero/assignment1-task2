// Requirements Declarations
const Express = require("express");
const { MongoClient } = require("mongodb");
const { ObjectID } = require("mongodb");
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

// Endpoint to add comment to image
app.post("/imagecomment", (req, res) => {
  console.log("Comment: ", req.body.comment);
  let comment = req.body.comment;
  let id = req.body.postId;
  commentImage(id, comment, res);
});

let imageCollection;

// Set connection to Instagram Database and Images Collection
const openConnection = (db) => {
  client.connect((err) => {
    if (err) throw err;
    imageCollection = client.db("instagram").collection("images");
  });
};

// Open database connection
openConnection();

// Insert an Image into database
const insertImage = (image, message) => {
  // Insert blank comments
  const comments = [];
  imageCollection.insertOne({
    image: image,
    message: message,
    comments: comments,
  });
};

// Retrieve images objects from database
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

// Update Images with Comments
const commentImage = (id, comment, res) => {
  // Set id and comment from POST Data to database object update
  imageCollection.updateOne(
    { _id: ObjectID(id) },
    { $addToSet: { comments: comment } },
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ result: "Failed Update" });
      } else {
        console.log("Comment added");
        res.send({ result: 200 });
      }
    }
  );
};

// Start Server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

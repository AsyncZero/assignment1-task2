const Express = require("express");
const { MongoClient } = require("mongodb");

// Mongo Database Mangement
const uri =
  "mongodb+srv://dbuser:dbuser@assignment1.uzdq3.mongodb.net/instagram?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let imageCollection;

const openConnection = (image, message) => {
  client.connect((err) => {
    imageCollection = client.db("instagram").collection("images");
  });
};

const insertImage = (image, message) => {
  imageCollection.insert({ image: image });
  imageCollection.insert({ message: message });
};

// Express Management
const app = new Express();

// Serve static page
app.use(Express.static("public"));

// Open database connection
openConnection();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

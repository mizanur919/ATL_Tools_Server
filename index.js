const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4b6iz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("DB Connected", uri);

///////

async function run() {
  try {
    await client.connect();
    // console.log('database connected successfully');
    const database = client.db("ssdm");
    const installationToolsCollection =
      database.collection("InstallationTools");

    // GET API
    app.get("/InstallationToolsList", async (req, res) => {
      const cursor = installationToolsCollection.find({});
      const toolsList = await cursor.toArray();
      res.send(toolsList);
    });

    // POST API
    app.post("/tool", async (req, res) => {
      const newTool = req.body;
      const cursor = await installationToolsCollection.insertOne(newTool);
      res.send(cursor);
    });

    // Delete API
    app.delete("/deleteTool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await installationToolsCollection.deleteOne(query);
      res.json(result);
    });

    // // GET Single Product
    // app.get("/products/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const product = await productCollection.findOne(query);
    //   res.json(product);
    // });

    // // POST API
    // app.post("/products", async (req, res) => {
    //   const products = req.body;
    //   console.log("hit the post api", products);

    //   const result = await productCollection.insertOne(products);
    //   console.log(result);
    //   res.json(result);
    // });

    // // GET Users info (Checking is admin or not)
    // app.get("/users/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const user = await usersCollection.findOne(query);
    //   let isAdmin = false;
    //   if (user?.role === "admin") {
    //     isAdmin = true;
    //   }
    //   res.json({ admin: isAdmin });
    // });

    // // USER POST API
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const result = await usersCollection.insertOne(user);
    //   console.log(result);
    //   res.json(result);
    // });

    // // DELETE API
    // app.delete("/products/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await productCollection.deleteOne(query);
    //   res.json(result);
    // });

    // // Make Admin
    // app.put("/users/admin", async (req, res) => {
    //   const user = req.body;
    //   console.log("put", user);
    //   const filter = { email: user.email };
    //   const updateDoc = { $set: { role: "admin" } };
    //   const result = await usersCollection.updateOne(filter, updateDoc);
    //   res.json(result);
    // });
  } finally {
  }
}

run().catch(console.dir);

///////

app.get("/", (req, res) => {
  res.send("server from node server");
});

app.get("/testing", () => {
  res.send("testing pass");
});

app.listen(port, () => {
  console.log("listing form port ", port);
});

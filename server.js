// // 
// // Import the required modules
// const express = require('express');
// const path = require('path');

// // Create an instance of an Express app
// const app = express();

// // Define the port
// const PORT = 3000;

// // Serve static files (like CSS, images, etc.) from the "public" folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Route to serve the home page
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// // Route to serve another page (e.g., About)
// app.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'about.html'));
// });

// // Handle 404 errors for unmatched routes
// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });


// Import required modules
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection string and options
const uri = "mongodb+srv://manziprince:<Password@250.>@cluster0.fpo8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client.db(''); // Replace 'testDB' with your database name
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Define routes
(async () => {
  const db = await connectToDatabase();
  const collection = db.collection('Cluster0'); // Replace 'items' with your collection name

  // GET: Fetch all items
  app.get('/api/items', async (req, res) => {
    try {
      const items = await collection.find().toArray();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  }); 

  // POST: Add a new item
  app.post('/api/items', async (req, res) => {
    try {
      const newItem = req.body;
      const result = await collection.insertOne(newItem);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: "Failed to add item" });
    }
  });

  // PUT: Update an item by ID
  app.put('/api/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedItem = req.body;
      const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedItem });
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Failed to update item" });
    }
  });

  // DELETE: Remove an item by ID
  app.delete('/api/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();

const express = require("express");
const app = express();
const fs = require("fs");

// Read the JSON file containing the fruit data
const fruitsData = JSON.parse(fs.readFileSync("fruitsdatabase.json"));

// Middleware to parse JSON request bodies
app.use(express.json());

// Get all fruits from the database
app.get("/api/fruits", (req, res) => {
  res.json(fruitsData);
});

// Get fruit by name
app.get("/api/fruits/:name", (req, res) => {
  const fruitName = req.params.name;
  const fruit = fruitsData.find(
    (f) => f.name.toLowerCase() === fruitName.toLowerCase()
  );

  if (!fruit) {
    return res.status(404).json({ message: "Fruit not found" });
  }

  res.json(fruit);
});

// Get fruit by ID
app.get("/api/fruits/:id", (req, res) => {
  const fruitId = req.params.id;
  const fruit = fruitsData.find((f) => f.id === fruitId);

  if (!fruit) {
    return res.status(404).json({ message: "Fruit not found" });
  }

  res.json(fruit);
});

// Create a new fruit
app.post("/api/fruits", (req, res) => {
  const newFruit = req.body;

  // Check if the fruit already exists
  const existingFruit = fruitsData.find(
    (f) => f.name.toLowerCase() === newFruit.name.toLowerCase()
  );

  if (existingFruit) {
    return res.status(400).json({ message: "Fruit already exists" });
  }

  // Add the new fruit to the database
  fruitsData.push(newFruit);
  fs.writeFileSync("fruitsdatabase.json", JSON.stringify(fruitsData, null, 2));

  res.status(201).json(newFruit);
});

// Update a fruit by ID
app.put("/api/fruits/:id", (req, res) => {
  const fruitId = req.params.id;
  const updatedFruit = req.body;

  const index = fruitsData.findIndex((f) => f.id === fruitId);

  if (index === -1) {
    return res.status(404).json({ message: "Fruit not found" });
  }

  fruitsData[index] = updatedFruit;
  fs.writeFileSync("fruitsdatabase.json", JSON.stringify(fruitsData, null, 2));

  res.json(updatedFruit);
});

// Delete a fruit by name
app.delete("/api/fruits/:name", (req, res) => {
  const fruitName = req.params.name;
  const index = fruitsData.findIndex(
    (f) => f.name.toLowerCase() === fruitName.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ message: "Fruit deleted by name" });
  }

  const deletedFruit = fruitsData.splice(index, 1);
  fs.writeFileSync("fruitsdatabase.json", JSON.stringify(fruitsData, null, 2));

  res.json(deletedFruit[0]);
});

// Delete a fruit by ID
app.delete("/api/fruits/:id", (req, res) => {
  const fruitId = req.params.id;
  const index = fruitsData.findIndex(
    (f) => f.id.toLowerCase() === fruitId.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ message: "Fruit deletd by id" });
  }

  const deletedFruit = fruitsData.splice(index, 1);
  fs.writeFileSync("fruitsdatabase.json", JSON.stringify(fruitsData, null, 2));

  res.json(deletedFruit[0]);
});

app.listen(3000, () => console.log("Listening on port 3000"));


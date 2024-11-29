var path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "../../dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist", "index.html")); // Path to the index.html in dist
});
// TextRazor API Integration
const TEXT_RAZOR_API_URL = "https://api.textrazor.com/";

// API Home Route
app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body; // Receive input text from the client
    if (!text) {
      return res.status(400).json({ error: "Text input is required" });
    }

    // Make a POST request to TextRazor API using fetch
    const response = await fetch(TEXT_RAZOR_API_URL, {
      method: "POST",
      headers: {
        "x-textrazor-key": process.env.TEXTRAZOR_API_KEY, // Use API key from .env
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        extractors: "entities,topics,phrases",
        text: text,
      }),
    });

    // Check for response status
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API error: ${response.statusText} - ${errorDetails}`);
    }

    // Parse JSON response
    const data = await response.json();

    // Send the API response back to the client
    res.status(200).send(data);
  } catch (error) {
    console.error("Error calling TextRazor API:", error.message);
    res
      .status(500)
      .json({ error: "Failed to analyze text. Please try again later." });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

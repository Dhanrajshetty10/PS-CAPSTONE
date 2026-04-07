const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/predict", (req, res) => {
  const inputData = req.body;
  const data = JSON.stringify(inputData);

  const scriptPath = path.join(__dirname, "../ml/predict.py");

  execFile("python", [scriptPath, data], (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error in prediction");
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      console.error(stderr);
      res.status(500).send("Invalid response from Python");
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

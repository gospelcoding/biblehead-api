const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());
const env = app.get("env");
const port = env == "production" ? 80 : 3000;

app.post("/api/verses", async (req, res) => {
  try {
    const data = req.body;
    const code = await db.saveVerses(
      data.code,
      JSON.stringify(data.verses),
      data.formatVersion
    );
    res.json({ code: code });
  } catch (error) {
    console.error("Failed to post verse library");
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.get("/api/verses/:code", async (req, res) => {
  try {
    const values = await db.getVerses(req.params.code);
    if (!values) res.status(404).send(`No verses for code: ${req.params.code}`);
    else {
      res.json(values);
    }
  } catch (error) {
    console.error("Failed to fetch verse library");
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}!\nValue of env is ${app.get("env")}`
  )
);

// DB

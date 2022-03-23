const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

var corsOptions = {
    origin: 'https://tf-picar-listener.herokuapp.com/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use("/public", express.static("public"));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.options('*', cors())

// Endpoint for the json
app.post("/tf/:name", function (req, res) {
    const name = req.params.name;
    const data = req.body

    console.log(`POST from ${name} - writing to file`);
    console.log(data)
    if (data !== undefined) {
        fs.writeFileSync(`models/${name}.json`, JSON.stringify(data));
    } else {
        console.error("No data sent")
    }
    console.log(req);
    console.log(data);
    res.end();
})

app.get("/models", (req, res) => {
    const files = fs.readdirSync("models");
    res.json({models: files})
})

app.delete("/models/:name", (req, res) => {
    const model = req.params.name;
    fs.unlinkSync(`models/${model}.json`)
})

app.get("/status/:name", (req, res) => {
    const name = `models/${req.params.name}.json`;
    const content = fs.readFileSync(name);
    const json = JSON.parse(content);
    res.send(json);
})

app.listen(process.env.PORT || 3000,
	() => console.log("Running server."));
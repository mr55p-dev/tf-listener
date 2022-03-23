const express = require('express');
const fs = require('fs');

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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

app.get("/status/:name", (req, res) => {
    const name = `models/${req.params.name}.json`;
    const content = fs.readFileSync(name);
    const json = JSON.parse(content);
    res.send(json);
})

app.listen(process.env.PORT || 3000,
	() => console.log("Running server."));
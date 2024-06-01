import express from 'express';
import axios from 'axios';
import bodyParser from "body-parser";
import ejs from 'ejs';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
})

app.get("/qr", (req, res) => {
  res.render("qr.ejs");
})

app.post("/qrr",async(req,res)=>{
  try {
    res.render("qr.ejs", { value:`http://api.qrserver.com/v1/create-qr-code/?data=${req.body.lat}&size=${req.body.size1}x${req.body.size1}`});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.get("/cat",async(req,res)=>{
  try {
    res.render("cat.ejs", {value : "https://cataas.com/cat"});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
})

app.post("/exchange",async(req,res)=>{
  try {
    const response = await axios.get("https://currency-exchange.p.rapidapi.com/exchange", {
      params: { 
        from: req.body.cfrom,
        to: req.body.cto,
        q: req.body.amount
       },
      headers: { 
        'X-RapidAPI-Key': '164dd16bccmsh86d863e89971003p1fb152jsnb6b3c40ed3b9',
        'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
      }
    });
    const result = response.data;
    res.render("exc.ejs", {value : result , from_real : req.body.cfrom , to_real : req.body.cto , count_real : req.body.amount});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
})

app.get("/exc", async(req, res) => {
  try {
    const response = await axios.get("https://currency-exchange.p.rapidapi.com/listquotes", {
      headers: { 
        'X-RapidAPI-Key': '164dd16bccmsh86d863e89971003p1fb152jsnb6b3c40ed3b9',
        'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
      }
    });
    const result = response.data;
    res.render("exc.ejs", {list_real : result});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});


app.get("/joke", async (req, res) => {
  try {
    const response = await axios.get("https://v2.jokeapi.dev/joke/Any?format=json");
    const result = response.data;
    res.render("jokes.ejs", { org_setup: result.setup, org_delivery: result.delivery });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.get("/jokes", (req, res) => {
  res.render("jokes.ejs");
});

app.post("/post-covid", async (req, res) => {
  try {

    const response = await axios.get("https://covid-193.p.rapidapi.com/statistics", {
      params: { country: req.body.country },
      headers: { 
        'X-RapidAPI-Key': '164dd16bccmsh86d863e89971003p1fb152jsnb6b3c40ed3b9',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    });
    const result = response.data;
    res.render("covid.ejs", { Country_1:req.body.country, Population: result.response[0].population,
       Cases: result.response[0].cases.total,Deaths: result.response[0].deaths.total , 
       Tests: result.response[0].tests.total});
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.get("/covid", (req, res) => {
  res.render("covid.ejs");
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
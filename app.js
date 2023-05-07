const express = require('express');
const fetch = require('node-fetch');
const path=require("path");
const mongoose = require('mongoose');

const app = express();

const staticPath= path.join(__dirname,"./views");
app.use(express.static(staticPath));
app.set('view engine',"ejs");

mongoose.connect('mongodb+srv://vishnu:vishnu@cluster0.ixrwzyw.mongodb.net/vishnu?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const tickerSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String,
  });
  
  const Ticker = mongoose.model('Ticker', tickerSchema);

  setInterval(fetchAndStoreTickers, 60000);

  async function fetchAndStoreTickers() {
    const response = await fetch('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();
    const top10 = Object.values(data).slice(0, 10);
  
    try {
      console.log("hi there")
      await Ticker.deleteMany({});
      await Ticker.insertMany(top10);
      console.log(top10);
      console.log('Tickers stored successfully');
    } catch (error) {
      console.log('Error storing tickers:', error);
    }
  }
  

  app.get('/tickers', async (req, res) => {
    try {
       await Ticker.find({})
      .then((x)=>{res.render("index",{x});console.log(x)})
      .catch(err=>console.log(err));
    } catch (error) {
      console.error('Error retrieving tickers:', error);
      res.status(500).send('Error retrieving tickers');
    }
  });


  app.listen(3000, async () => {
    console.log('Server started on port 3000');
  });
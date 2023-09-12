const express = require('express');
const axios = require('axios');
const app = express();
const port = 5502;
const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
const baseApiUrl = 'https://www.googleapis.com/youtube/v3';


// Most Popular Videos
//https://www.googleapis.com/youtube/v3/search?key=apiKey&type=video&part=snippet&chart=mostPopular
app.get('/search/mostPopular', async (req, res, next) => {
  try {
    
    res.setHeader('Permissions-Policy', 'feature=value');
    
    //const searchQuery = req.query.search_mostPopular;
    const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&chart=mostPopular`
    const response = await axios.get(url);
    console.log(response)
  }
  catch(error) {
    console.log(error)
  }
    
})


// Videos Searched By Query
// https://www.googleapis.com/youtube/v3/search?key=apiKey&type=video&part=snippet&q=palmeiras
app.get('/search/query', async (req, res, next) => {
  try {
    
    res.setHeader('Permissions-Policy', 'feature=value');
    
    const searchQuery = req.query.search_query;
    const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`
    const response = await axios.get(url);
    console.log(response)
  }
  catch(error) {
    console.log(error)
  }
    
})


app.listen(port, () => {
  console.log("App is started", port);
});
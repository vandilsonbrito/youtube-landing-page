const express = require('express')
const axios = require('axios')
const app = express();
const port = 5502;
const apiKey = "AIzaSyDxoDC-gcdR3js4c9hye0SijsYG6YukZX8";
const baseApiUrl = 'https://www.googleapis.com/youtube/v3';

// Videos Searched By Query
//https://www.googleapis.com/youtube/v3/search?key=apiKey&type=video&part=snippet&chart=mostPopular
app.get('/search', async (req, res, next) => {
  try {
    
    res.setHeader('Permissions-Policy', 'feature=value');
    
    const searchQuery = req.query.search_mostPopular;
    const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&chart=mostPopular`
    const response = await axios.get(url);
    
  }
  catch(error) {
    next(error)
  }
    
})


// Most Popular Videos
// https://www.googleapis.com/youtube/v3/search?key=apiKey&type=video&part=snippet&q=palmeiras
app.get('/search', async (req, res, next) => {
  try {
    
    res.setHeader('Permissions-Policy', 'feature=value');
    
    const searchQuery = req.query.search_query;
    const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`
    const response = await axios.get(url);
    console.log(response)
  }
  catch(error) {
    next(error)
  }
    
})


app.listen(port, () => {
  console.log("App is started", port);
});
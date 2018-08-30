require("dotenv").config();
var fs = require('fs');

var request = require('request');
var moment = require('moment');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

var userInput = process.argv[2];
var userInput2 = process.argv.slice(3).join(" ");

// Bands in Town
if (userInput === "concert-this") {
    bandsInTown();
}

// Spotify 
else if (userInput === "spotify-this-song") {
    spotifyAPI();
}
// OMDB
else if (userInput === "movie-this") {
    OMDBFunc();
}
// Do what it says
else if (userInput === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        userInput2 = dataArr[1];
        if (dataArr[0] === "concert-this") {
            bandsInTown();
        } else if (dataArr[0] === `spotify-this-song`) {
            spotifyAPI();
        } else if (dataArr[0] === "movie-this") {
            OMDBFunc();
        }
    })
}

// Functions
// Bandsintown Function
function bandsInTown() {
    request("https://rest.bandsintown.com/artists/" + userInput2 + "/events?app_id=codingbootcamp", function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

        var info = JSON.parse(body)[0];

        console.log("Name of venue: " + info.venue.name);
        console.log("Venue location: " + info.venue.city);

        console.log("Date: " + moment(info.datetime).format('MMMM Do YYYY'));
    })
}

// SPOTIFY FUNCTION
function spotifyAPI() {
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: userInput2 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist(s): " + data.tracks.items[0].artists[0].name)
        console.log("Song name: " + data.tracks.items[0].name)
        console.log("Link to song: " + data.tracks.items[0].external_urls.spotify)
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

// OMDB Function
function OMDBFunc() {
    request('http://www.omdbapi.com/?apikey=3bcc5203&t=' + userInput2, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var info = JSON.parse(body);

        console.log("Title: " + info.Title);
        console.log("Year: " + info.Year);
        console.log("IMDB rating: " + info.Ratings[0].Value);
        console.log("Rotten Tomatoes rating: " + info.Ratings[1].Value);
        console.log("Country/countries where movie was produced: " + info.Country);
        console.log("Language(s): " + info.Language);
        console.log("Plot: " + info.Plot);
        console.log("Actors: " + info.Actors);
    });
}
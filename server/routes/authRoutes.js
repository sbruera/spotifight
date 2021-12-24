const express = require('express');
const router = express.Router();
const generateRandomString = require('./../utils/cryptoUtils');
const  hostController  = require('./../controllers/hostController.js')
const request = require("request");
const dotenv = require('dotenv');
const Host = require('../models/hostModel');

//TODO: TRY TO REMOVE THIS FROM EVERY FILE THAT NEEDS ENV VARIABLES
dotenv.config();
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;



//TODO: GET ACCESS TOKEN FROM DATABASE, BASED ON HOST ID
//TODO: REFACTOR TO HAVE SEVERAL HOST

global.access_token = "";

router.get("/login", (req, res) => {
    req.flash('hostName', req.query.hostName);
    

    var scope =
      "streaming user-read-email user-read-private app-remote-control user-modify-playback-state user-read-playback-state";
    var state = generateRandomString(16);
  
    var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state,
    });
    res.redirect(
      "https://accounts.spotify.com/authorize/?" +
        auth_query_parameters.toString()
    );
  });
  
  router.get("/callback", (req, res) => {
    var code = req.query.code;
  
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    };
  
    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;

        await Host.create({name: req.flash('hostName')[0], spotifyAccessToken: access_token});

        res.redirect("/");

      }
    });
  });
  
  router.get("/token", (req, res) => {
    res.json({ access_token: access_token });
  });
  
  router.get("/refresh_token", function (req, res) {
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
            "base64"
          ),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      json: true,
    };
  
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          access_token: access_token,
        });
      }
    });
  });


module.exports = router;
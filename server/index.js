const express = require("express");
const request = require("request");
const dotenv = require("dotenv");
const cors = require("cors");

const port = 5000;

global.access_token = "";

dotenv.config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var spotify_redirect_uri = "http://localhost:8080/auth/callback";

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.use(cors());

app.get("/auth/login", (req, res) => {
  var scope =
    "streaming user-read-email user-read-private app-remote-control user-modify-playback-state user-read-playback-state";
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });
  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

app.get("/auth/callback", (req, res) => {
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect("/");
    }
  });
});

app.get("/auth/token", (req, res) => {
  res.json({ access_token: access_token });
});

app.get("/auth/refresh_token", function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer(spotify_client_id + ":" + spotify_client_secret).toString(
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

app.get("/auth/saved_songs", function (req, res) {
  var authOptions = {
    url: "https://api.spotify.com/v1/me/tracks",
    headers: {
      Authorization:
        "Basic " +
        Buffer(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
    },
    json: true,
  };

  request.get(authOptions, function (error, response, body) {
    console.log("response", response);
    console.log("error", error);
    console.log("body", body);
    if (!error && response.statusCode === 200) {
      res.send({
        body: body,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

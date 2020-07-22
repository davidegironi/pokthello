// Copyright (c) 2020 Davide Gironi
// Please refer to LICENSE file for licensing information.

// import libs
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const axios = require('axios');
const apicache = require('apicache');
const rateLimit = require('express-rate-limit');
const favicon = require('serve-favicon');

// import config
require('dotenv').config();
const packagejson = require('../package.json');

// set app
const app = express();

// load cache
const cache = apicache.middleware;

// set middlewares
app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use(express.json());

// serve static pages
if (process.env.SERVESTATICPAGES) {
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static('public'));
} else {
  // set root route
  app.get('/', (req, res) => {
    res.json({ message: `Hamletmon API version ${packagejson.version}` });
  });
}

// set /pokemon/:name route, cached and limited due to the shakespeareapi limit
app.get('/pokemon/:name',
  process.env.RATELIMIT
    ? rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 60,
      handler: () => {
        throw new Error('Too many requests, please try again later.');
      },
    })
    : (req, res, next) => next(),
  // eslint-disable-next-line no-nested-ternary
  process.env.NODE_ENV !== 'test'
    ? cache('60 minutes')
    : (req, res, next) => next(),
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const response = await axios.get(process.env.POKEMONAPI + name);
      const speciesurl = response ? response.data.species : null;
      const responsespecies = await axios.get(speciesurl.url);
      const description = responsespecies
        ? responsespecies.data.flavor_text_entries
          .filter((r) => r.language.name === 'en')[0]
          .flavor_text
          .split('\n').join(' ')
          .split('\f').join(' ')
        : null;
      let shakesription = description;
      if (process.env.NODE_ENV !== 'test') {
        const responsetranslation = await axios.post(
          process.env.SHAKESPEAREAPI,
          {
            text: description,
          },
        );
        shakesription = responsetranslation
          ? responsetranslation.data.contents.translated : null;
      }
      res.send({
        name,
        description: shakesription,
      });
    } catch (err) {
      next(err);
    }
  });

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404);
  res.send({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let error = err.message;
  if (err.response) {
    if (!err.response.status) res.status(500);
    else res.status(err.response.status);
    if (err.response.status === 404) error = 'Pokemon or route not found';
  } else {
    res.status(500);
  }
  res.send({
    error,
    stack: process.env.NODE_ENV === 'production' ? '/' : err.stack,
  });
});

// set port
const port = process.env.PORT || 1337;

// build server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening to port ${port}`);
});

module.exports = server;

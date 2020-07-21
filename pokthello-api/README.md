About
===
pOkTHELLO API is the RESTful api built on top of express js for the pOkTHELLO web page.

## Routes
* **/**: main route
* **/pokemon/:name**: returns the formatted json of the pokemon requested  

**Successful** requests returns:
* Status: 200
* Body: JSON
  
**Unsuccessful** requests returns:
* Status: not equal to 200
* Body: JSON with an error message

## Install
```bash
npm install
```

## Run
```bash
npm start
```

## Debug
```bash
npm run dev
```

## Linter
```bash
npm run lint
```

## Test
```bash
npm test
```

## License
Copyright (c) Davide Gironi, 2020.  
This project is an open source software licensed under the [GPLv3 license](http://opensource.org/licenses/GPL-3.0)
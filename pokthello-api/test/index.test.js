// load libs
const chai = require('chai');
const chaiHttp = require('chai-http');

// load app
const app = require('../src/index.js');

// set chai
const { expect } = chai;
chai.use(chaiHttp);

// do test
describe('Main Route', () => {
  describe('GET /pokemon/ditto', () => {
    it('it should return a pokemon info', () => {
      chai.request(app)
        .get('/pokemon/ditto')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
        });
    });
  });
});

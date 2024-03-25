/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import mongoose from "mongoose";
import User from '../models/user.js';

import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../app.js';
const should = chai.should();

const {expect} = chai;


chai.use(chaiHttp);

describe('Users', () => {
    // beforeEach((done) => { //empty the database
    //     User.remove({}, (err) => { 
    //        done();           
    //     });        
    // });
/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
        chai.request(app)
            .get('/api/v1/users/')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                //   res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST user', () => {
    it('it should not create a user without phone number field', (done) => {
        let user = {
            firstName: "The Lord of the Rings",
            firstName: "J.R.R. Tolkien",
            email: "fmogbana11@yahoo.com",
            phoneNumber: 2348130148567,
            password: "qwerty123"
        }
      chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
            done();
          });
    });

});

});
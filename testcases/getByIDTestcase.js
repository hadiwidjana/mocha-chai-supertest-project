const chai = require('chai')
const expect = chai.expect;
const api = require('../api/fazztrackAPI');
const jsonPostData = require('../data/create-user.json');
const jsonSchemaGet = require('../schemas/get-user-schema.json');

chai.use(require('chai-like'));
chai.use(require('chai-things'));
chai.use(require('chai-json-schema'));

var targetID = null;

describe('[@get-data] GET testcases', async() => {
    before(async() => {
        //initial post the data
        let response = await api.postUser(jsonPostData);
        expect(response.status).to.equal(200);
        targetID = response.body.id;

    });

    after(async () =>{
        //delete after finish
        let response = await api.deleteUser(targetID);
        expect(response.status).to.equal(200);
    });


    it('[@positive1] search user by valid ID', async() => {
        let response = await api.getUserById(targetID);
        expect(response.status).to.equal(200); //status code check
        expect(response.body.id).to.equal(targetID); //ID check
        expect(response.body).jsonSchema(jsonSchemaGet); //schema check
    });

    it('[@negative1] search user by invalid ID', async() => {
        let response = await api.getUserById("12345");
        expect(response.status).to.equal(404); //status code check
        expect(response.body.errorCode).to.equal("ER-01"); //Error code check
        expect(response.body).to.contain.like({"message": "user not found"});
    });


})
const chai = require('chai')
const expect = chai.expect;
const api = require('../api/fazztrackAPI');
const jsonPostData = require('../data/create-user.json');
const jsonSchemaPut = require('../schemas/put-user-schema.json');
const updateData = require('../data/update-data.json');

chai.use(require('chai-like'));
chai.use(require('chai-things'));
chai.use(require('chai-json-schema'));

var targetID = null;

describe('[@update-data] PUT testcases', async() => {
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


     it('[@positive1] update occupation and nationality data', async() => {
        //update ID and other datas
        updateData.id=targetID
        let occupationUpdate = "Soccer Player"
        let nationalityUpdate = "Indonesian"
        updateData.occupation = occupationUpdate
        updateData.nationality = nationalityUpdate
        
     
        let response = await api.putUser(updateData);
        expect(response.status).to.equal(200); //status code check
        expect(response.body.id).to.equal(targetID); //ID check
        expect(response.body).to.contain.like({occupation: occupationUpdate, nationality: nationalityUpdate}); //data check
        expect(response.body).jsonSchema(jsonSchemaPut); //schema check
    });

    it('[@negative1] fail to update when age is 0', async() => {
        updateData.age = 0;
        let response = await api.putUser(updateData);
        expect(response.status).to.equal(400); //status code check
        expect(response.body.errorCode).to.equal('ER-03'); //Error code check
        expect(response.body).to.contain.like({"message": "you must specify data for firstname, lastName, age, occupation, nationality, hobbies (at least 1), and gender"}); //data check

        updateData.age = 30;
    });

    it('[@negative2] fail to update when hobbies is empty array', async() => {
        updateData.hobbies.length=0;
        let response = await api.putUser(updateData);
        expect(response.status).to.equal(400); //status code check
        expect(response.body.errorCode).to.equal('ER-03'); //Error code check
        expect(response.body).to.contain.like({"message": "you must specify data for firstname, lastName, age, occupation, nationality, hobbies (at least 1), and gender"}); //data check

        updateData.hobbies=["Riding a motorcycle"];
    });

    it('[@negative3] fail to update when id is null', async() => {
        updateData.id = null;
        let response = await api.putUser(updateData);
        expect(response.status).to.equal(404); //status code check
        expect(response.body.errorCode).to.equal('ER-01'); //Error code check
        expect(response.body).to.contain.like({"message": "user not found"}); //data check

        updateData.id = targetID;
    })


})
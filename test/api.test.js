process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
const server = require('../api');

chai.use(chaiHttp);

setTimeout(function() {
    describe('/GET health', () => {

        it('Request should return status 200', (done) => {
            chai.request(server)
                .get('/v1/health/')
                .set("x-web-access-token",process.env.API_WEBTOKEN)
                .end((err,res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        });

    });

    describe('/POST Login', () => {

        it('Request should send parameters trying to login. Returning status 200', (done) => {
            chai.request(server)
                .post('/v1/auth/login/')
                .set("x-web-access-token",process.env.API_WEBTOKEN)
                .set('content-type', 'application/json')
                .send({
                    email : 'admin@base.com',
                    password : '123456'
                })
                .end((err,res) => {
                    expect(res).to.have.status(200);
                    done();
                })
        });

    });

    run();
}, 3000)
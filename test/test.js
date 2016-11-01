var should = require('chai').should(),
	expect = require('chai').expect,
	supertest = require('supertest'),
	api = supertest('http://localhost:3000');

var regular_user, admin_user, webtoken, entry_id;

describe('API Unit Testing', function(){
	describe('/api/users/register', function(){
		it('should return 200', function(done) {
	        api.post('/api/users/register')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
	          	email: 'mochatest@gmail.com',
	          	password: 'apple',
	          	username: 'test.user',
	          	firstname: 'firstname',
	          	lastname: 'lastname',
	          	expected_calories_day: 90,
	          	role: 3,
	          	status: true
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) done(err);
				
				expect(res.body.success).to.equal(true);
				regular_user = res.body.result._id;
			});

			api.post('/api/users/register')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
	          	email: 'shibar@gmail.com',
	          	password: 'apple',
	          	username: 'panda.yu',
	          	firstname: 'Panda',
	          	lastname: 'Yu',
	          	expected_calories_day: 60,
	          	role: 1,
	          	status: true
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) done(err);
				
				expect(res.body.success).to.equal(true);
				admin_user = res.body.result._id;

				done();
			});
		});
	});

	describe('/api/users/auth', function(){
		it('no email, should return 400', function(done) {
			api.post('/api/users/auth')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({})
			.expect('Content-Type', /json/)
			.expect(400)
			.end(done);
		});

		it('login as a regular user, should return 200', function(done) {
			api.post('/api/users/auth')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
				email: 'mochatest@gmail.com',
	          	password: 'apple'
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) done(err);
				
				expect(res.body.token).to.not.equal(null);
				webtoken = res.body.token;

				done();
			});
		});
	});

	describe('/api/users/getUserInformation', function(){
		it('no token, should return 401', function(done) {
			api.get('/api/users/getUserInformation')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, should return 200', function(done) {
			api.get('/api/users/getUserInformation')
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err){
					done(err);
				}else{
					expect(res.body.user).to.have.property("email");
					expect(res.body.user).to.have.property("username");
					expect(res.body.user).to.have.property("firstname");
					expect(res.body.user).to.have.property("lastname");

					done();
				}
			});
		});
	});

	describe('/api/users/updateProfile', function(){
		it('no token, should return 401', function(done) {
			api.post('/api/users/updateProfile')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, should return 200', function(done) {
			api.post('/api/users/updateProfile')
			.send({
				token: webtoken,
				username: 'test'
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(done);
		});
	});


	describe('/api/meals/add', function(){
		it('no token, should return 401', function(done) {
			api.post('/api/meals/add')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, should return 200', function(done) {
			api.post('/api/meals/add')
			.send({
				token: webtoken,
				description: 'breakfast',
				date: '2015-10-10',
				time: '15:04:20',
				num_of_calories: 40
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (!err){
					entry_id = res.body.entry._id;
				}
				done();
			});
		});
	});

	describe('/api/meals/getList', function(){
		it('no token, should return 401', function(done) {
			api.get('/api/meals/getList')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, should return 200', function(done) {
			api.get('/api/meals/getList')
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err){
					done(err);
				}else{
					expect(res.body.entries).to.not.equal("null");
					done();
				}
			});
		});
	});

	describe('/api/meals/updateEntryByID/:id', function(){
		it('token provided, should return 200', function(done) {
			api.post('/api/meals/updateEntryByID/' + entry_id)
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(done);
		});
	});

	describe('/api/users/auth - admin login', function(){
		it('no email, should return 400', function(done) {
			api.post('/api/users/auth')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({})
			.expect('Content-Type', /json/)
			.expect(400)
			.end(done);
		});

		it('login as a admin user, should return 200', function(done) {
			api.post('/api/users/auth')
			.set('Accept', 'application/x-www-form-urlencoded')
			.send({
				email: 'shibar@gmail.com',
	          	password: 'apple'
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) done(err);
				
				expect(res.body.token).to.not.equal(null);
				webtoken = res.body.token;

				done();
			});
		});
	});

	describe('/api/users/getList', function(){
		it('no token, should return 401', function(done) {
			api.get('/api/users/getList')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, should return 200', function(done) {
			api.get('/api/users/getList')
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err){
					done(err);
				}else{
					expect(res.body.users).to.not.equal("null");
					done();
				}
			});
		});
	});

	describe('/api/users/getUserInfoById/:id', function(){
		it('no token, should return 401', function(done) {
			api.get('/api/users/getUserInfoById/:id')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, should return 200', function(done) {
			api.get('/api/users/getUserInfoById/' + regular_user)
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err){
					done(err);
				}else{
					expect(res.body.user).to.have.property("email");
					expect(res.body.user).to.have.property("username");
					expect(res.body.user).to.have.property("firstname");
					expect(res.body.user).to.have.property("lastname");

					done();
				}
			});
		});
	});

	describe('/api/users/deleteById/:id', function(){
		it('no token, should return 401', function(done) {
			api.get('/api/users/deleteById/:id')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, removes regular user, return 200', function(done) {
			api.get('/api/users/deleteById/' + regular_user)
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(done);
		});

		it('token provided, removes admin user, return 200', function(done) {
			api.post('/api/users/deleteProfile')
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(done);
		});
	});

	describe('/api/meals/deleteEntryUnlimited/:id', function(){
		it('no token, should return 401', function(done) {
			api.get('/api/meals/deleteEntryUnlimited/:id')
			.set('Accept', 'application/x-www-form-urlencoded')
			.expect('Content-Type', /json/)
			.expect(401)
			.end(done);
		});

		it('token provided, removes entry, return 200', function(done) {
			api.get('/api/meals/deleteEntryUnlimited/' + entry_id)
			.send({
				token: webtoken
			})
			.expect('Content-Type', /json/)
			.expect(200)
			.end(done);
		});
	});
});
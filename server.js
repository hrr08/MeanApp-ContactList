const express = require('express'),
	  bodyParser = require('body-parser'),
	  mongodb = require('mongodb');
	  
	  
var ObjectID = mongodb.ObjectID;
var CONTACTS_COLLECTION = 'contacts';
	 
var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
	if(err) {
		console.log(err);
		process.exit(1);
	}
	
	db = database;
	console.log('Database connection ready');
	
	// Initializing the app
	var server = app.listen(process.env.PORT || 8080, function () {
		var port = server.address().port;
		console.log('App now running on port', port);
	});
});

//CONTACTS API ROUTES BELOW

function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error": message});
}

/* "/api/contacts"
 * GET: finds all contacts
 * POST: creates a new contact
 */
 
 app.get('/api/contacts', function(req, res) {
	db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
		if(err) {
			handleError(res, err.message, 'Failed to get contacts.');
		} else {
			res.status(200).json(docs);
		}
	});
 });
 
 app.post('/api/contacts', function(req, res) {
	var newContact = req.body;
	newContact.createDate = new Date();
	
	if(!req.body.name) {
		handleError(res, 'Invalid user input', 'Must provide a name.', 400);
	}
	
	db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
		if(err) {
			handleError(res, err.message, 'Failed to create new contact.');
		}
		else {
			res.status(201).json(doc.ops[0]);
		}
	});	
 });
 
 /* '/api/contacts/:id'
  * GET: find contact by id
  * PUT: update contact by id
  * DELETE: deletes contact by id
  */
 
 app.get('/api/contacts/:id', function(req, res) {
	db.collection(CONTACTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
		if(err)  {
			handleError(res, err.message, "Failed to get contact");
		}
		else {
			res.status(200).json(doc);
		}
	});
 });
 
 app.put('/api/contacts/:id', function(req, res) {
	var updateDoc = req.body;
	delete	updateDoc._id;
	
	db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
		if(err) {
			handleError(res, err.message, "Failed to update contact");
		}
		else {
			updateDoc._id = req.params.id;
			res.status(200).json(updateDoc);
		}
	});
 });
 
 
 app.delete('/api/contacts/:id', function(req, res) {
	db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
		if (err) {
		  handleError(res, err.message, "Failed to delete contact");
		} else {
		  res.status(200).json(req.params.id);
		}
	}); 
 });
 
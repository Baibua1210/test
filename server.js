var express = require('express');
var app = express();
//setup mongo 
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var option = { useUnifiedTopology: true, useNewUrlParser: true };

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.render('pages/index');
});

app.get("/class", function (req, res) {
    var classid = req.params.id;
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {
            subject_id: /^140/
        };
        var sort = {
            subject_name: -1
        }
        dbo.collection("classroom")
            .find(query)
            .toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/class', { classes: result });
                db.close();
            });
    });

});
app.get("/classdetail/:id", function (req, res) {
    var classid = req.params.id;
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = { subject_id: classid };
        dbo.collection("classroom")
            .findOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/classdetail', { detail: result });
                db.close();
            });
    });

});
app.get("/classedit/:id", function (req, res) {
    var classid = req.params.id;
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = { subject_id: classid };
        dbo.collection("classroom")
            .findOne(query, function (err, result) {
                if (err) throw err;
                console.log(result);
                res.render('pages/classedit', { detail: result });
                db.close();
            });
    });

});
app.post("/classsave", function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var room = req.body.room;
    MongoClient.connect(url, option, function (err, db) {
        if (err) throw err;
        var dbo = db.db("coc");
        var query = {
            subject_id: id
        }
        //set new value
        var newvalues = {
            $set: { room: room, subject_name: name }
        };
        dbo.collection("classroom")
            .updateOne(query, newvalues, function (err, result) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
                res.redirect("/class");
                //edit
                //hello
            });
    });
});


app.listen(8080);
console.log('Express started at http://localhost:8080');
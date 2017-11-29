module.exports = function(){
    var express = require('express');
    var router = express.Router();
	/*
	//getPlanets
    function getPlanets(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM bsg_planets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }*/

	//getPeople
    function getHandguns(res, mysql, context, complete){
       //mysql.pool.query("SELECT handguns_id, handguns_brand, handguns_model, ammunition_caliber, handguns_barrel_length FROM Handguns, Ammunition a1 INNER JOIN Ammunition a2 ON a1.id = a2.ammunition_caliber", function(error, results, fields){
		mysql.pool.query("SELECT Handguns.handguns_id, handguns_brand, handguns_model, handguns_caliber, handguns_barrel_length FROM Handguns INNER JOIN Ammunition A ON A.ammunition_id = Handguns.handguns_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.handguns = results;			//populates {{#each handguns}} in handguns.hbars
            complete();
        });
    }
	/*
	//getPerson
    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT id, fname, lname, homeworld, age FROM bsg_people WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }*/

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletehandguns.js"];
        var mysql = req.app.get('mysql');
        getHandguns(res, mysql, context, complete);
        //getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('handguns', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */
	/*
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateperson.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-person', context);
            }

        }
    });*/

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Handguns (handguns_brand, handguns_model, handguns_caliber, handguns_barrel_length) VALUES (?,?,?,?)";
        var inserts = [req.body.handguns_brand, req.body.handguns_model, req.body.handguns_caliber, req.body.handguns_barrel_length];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/handguns');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Handguns SET handguns_brand=?, handguns_model=?, handguns_caliber=?, handguns_barrel_length=? WHERE id=?";
        var inserts = [req.body.handguns_brand, req.body.handguns_model, req.body.handguns_caliber, req.body.handguns_barrel_length, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */
	/*
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM bsg_people WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })*/

    return router;
}();
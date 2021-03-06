module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
    function getAmmunition(res, mysql, context, complete){
		mysql.pool.query("SELECT ammunition_id, ammunition_caliber FROM Ammunition", function(error, results, fields){	
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ammunition_caliber  = results;
            complete();
        });
    }

    function getHandguns(res, mysql, context, complete){
		//this query shows SQL-added data and form-added data but does not update caliber correctly
		/*mysql.pool.query("SELECT Handguns.handguns_id, handguns_brand, handguns_model, handguns_caliber, handguns_barrel_length FROM Handguns INNER JOIN Ammunition A ON A.ammunition_id = Handguns.handguns_id", function(error, results, fields){*/
		//this query only shows form-added data but updates caliber correctly
        mysql.pool.query("SELECT Handguns.handguns_id, handguns_brand, handguns_model, Ammunition.ammunition_caliber AS handguns_caliber, handguns_barrel_length FROM Handguns INNER JOIN Ammunition ON handguns_caliber = Ammunition.ammunition_id", function(error, results, fields){
			if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.handguns = results;
            complete();
        });
    }
    function getPistol(res, mysql, context, id, complete){
		//handguns_id or id ok
		//do not add any table joins here
        var sql = "SELECT handguns_id, handguns_brand, handguns_model, handguns_caliber, handguns_barrel_length FROM Handguns WHERE handguns_id = ?";
        var inserts = [id];	//handguns_id or id ok
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pistol = results[0];
            complete();
        });
    }

    //Display all handguns
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepistol.js"];
        var mysql = req.app.get('mysql');
        getHandguns(res, mysql, context, complete);
        getAmmunition(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('handguns', context);
            }

        }
    });

    //Display one handgun for updating
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedammunition.js", "updatepistol.js"];
        var mysql = req.app.get('mysql');
        getPistol(res, mysql, context, req.params.id, complete);
        getAmmunition(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-pistol', context);
            }

        }
    });

    //Adds a handgun
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

    //For updating handguns
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Handguns SET handguns_brand=?, handguns_model=?, handguns_caliber=?, handguns_barrel_length=? WHERE handguns_id = ?";
        var inserts = [req.body.handguns_brand, req.body.handguns_model, req.body.handguns_caliber, req.body.handguns_barrel_length, req.params.id]; //id ok; comes from url "/:id"
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

    //Deletes a handgun
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Handguns WHERE handguns_id = ?";
        var inserts = [req.params.id]; //id ok; comes from url "/:id"
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
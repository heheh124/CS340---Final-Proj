module.exports = function(){
    var express = require('express');
    var router = express.Router();
	//edited - ok
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
	//edited - ok
    function getRifles(res, mysql, context, complete){
        mysql.pool.query("SELECT Rifles.rifles_id, rifles_brand, rifles_model, Ammunition.ammunition_caliber AS rifles_caliber, rifles_barrel_length FROM Rifles INNER JOIN Ammunition ON rifles_caliber = Ammunition.ammunition_id", function(error, results, fields){    
			if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rifles = results;
            complete();
        });
    }
	//edited - ok
    function getLonggun(res, mysql, context, id, complete){
		//handguns_id or id ok
		//do not add any table joins here
        var sql = "SELECT rifles_id, rifles_brand, rifles_model, rifles_caliber, rifles_barrel_length FROM Rifles WHERE rifles_id = ?";
        var inserts = [id];	//handguns_id or id ok
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.longgun = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/
	//edited - ok
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletelonggun.js"];
        var mysql = req.app.get('mysql');
        getRifles(res, mysql, context, complete);
        getAmmunition(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('rifles', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */
	//edited -not ok
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedammunition.js", "updatelonggun.js"];
        var mysql = req.app.get('mysql');
        getLonggun(res, mysql, context, req.params.id, complete);
        getAmmunition(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-longgun', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */
	//edited - ok
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Rifles (rifles_brand, rifles_model, rifles_caliber, rifles_barrel_length) VALUES (?,?,?,?)";
        var inserts = [req.body.rifles_brand, req.body.rifles_model, req.body.rifles_caliber, req.body.rifles_barrel_length];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/rifles');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */
	//edited - ok
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Rifles SET rifles_brand=?, rifles_model=?, rifles_caliber=?, rifles_barrel_length=? WHERE rifles_id = ?";
        var inserts = [req.body.rifles_brand, req.body.rifles_model, req.body.rifles_caliber, req.body.rifles_barrel_length, req.params.id]; //id ok; comes from url "/:id"
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
	//edited - ok
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Rifles WHERE rifles_id = ?";
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
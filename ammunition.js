module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
    function getCaliber(res, mysql, context, complete){
		mysql.pool.query("SELECT ammunition_id, ammunition_caliber FROM Ammunition", function(error, results, fields){	
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ammunition_caliber  = results;
            complete();
        });
    }

    function getAmmunition(res, mysql, context, complete){
        mysql.pool.query("SELECT Ammunition.ammunition_id, ammunition_brand, ammunition_model, ammunition_caliber, grain FROM Ammunition", function(error, results, fields){		
			if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.ammunition = results;
            complete();
        });
    }
    function getRound(res, mysql, context, id, complete){
        var sql = "SELECT ammunition_id, ammunition_brand, ammunition_model, ammunition_caliber, grain FROM Ammunition WHERE ammunition_id = ?";
        var inserts = [id];	//handguns_id or id ok
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.round = results[0];
            complete();
        });
    }

    //Display all ammunition
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteround.js"];
        var mysql = req.app.get('mysql');
        getAmmunition(res, mysql, context, complete);
        getCaliber(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('ammunition', context);
            }

        }
    });

    //Display one ammunition
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedammunition.js", "updateround.js"];
        var mysql = req.app.get('mysql');
        getRound(res, mysql, context, req.params.id, complete);
        getCaliber(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-round', context);
            }

        }
    });

    //Adds an ammunition
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Ammunition (ammunition_brand, ammunition_model, ammunition_caliber, grain) VALUES (?,?,?,?)";
        var inserts = [req.body.ammunition_brand, req.body.ammunition_model, req.body.ammunition_caliber, req.body.grain];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/ammunition');
            }
        });
    });

    //For updating ammunition
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Ammunition SET ammunition_brand=?, ammunition_model=?, ammunition_caliber=?, grain=? WHERE ammunition_id = ?";
        var inserts = [req.body.ammunition_brand, req.body.ammunition_model, req.body.ammunition_caliber, req.body.grain, req.params.id]; //id ok; comes from url "/:id"
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

    //Deletes an ammunition
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Ammunition WHERE ammunition_id = ?";
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
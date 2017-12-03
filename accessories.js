module.exports = function(){
    var express = require('express');
    var router = express.Router();
	
    function getType(res, mysql, context, complete){
		mysql.pool.query("SELECT accessories_id, accessories_type FROM Accessories", function(error, results, fields){	
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.accessories_type = results;
            complete();
        });
    }
	
    function getAccessories(res, mysql, context, complete){
        mysql.pool.query("SELECT Accessories.accessories_id, accessories_brand, accessories_model, accessories_type, compatibility FROM Accessories", function(error, results, fields){
			if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.accessories = results;
            complete();
        });
    }
	
    function getAccessory(res, mysql, context, id, complete){
        var sql = "SELECT accessories_id, accessories_brand, accessories_model, accessories_type, compatibility FROM Accessories WHERE accessories_id = ?";
        var inserts = [id];	//handguns_id or id ok
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.accessory = results[0];
            complete();
        });
    }

    //Displays all accessories
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteaccessory.js"];
        var mysql = req.app.get('mysql');
        getAccessories(res, mysql, context, complete);
        getType(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('accessories', context);
            }

        }
    });

    //Displays one accessory for updating
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedtype.js", "updateaccessory.js"];
        var mysql = req.app.get('mysql');
        getAccessory(res, mysql, context, req.params.id, complete);
        getType(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-accessory', context);
            }

        }
    });

    //Adds an accessory
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Accessories (accessories_brand, accessories_model, accessories_type, compatibility) VALUES (?,?,?,?)";
        var inserts = [req.body.accessories_brand, req.body.accessories_model, req.body.accessories_type, req.body.compatibility];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/accessories');
            }
        });
    });

    //For updating accessory
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Accessories SET accessories_brand=?, accessories_model=?, accessories_type=?, compatibility=? WHERE accessories_id = ?";
        var inserts = [req.body.accessories_brand, req.body.accessories_model, req.body.accessories_type, req.body.compatibility, req.params.id]; //id ok; comes from url "/:id"
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

    //Deletes an accessory
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Accessories WHERE accessories_id = ?";
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
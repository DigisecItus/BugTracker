"use strict";
let express = require('express'), app = express(), bodyParser = require('body-parser');
const PORT = 3100, IP = "localhost";
 const data = require('./msg.json');
 const G_BUG_MASTER_JSON = '{"bugid":"","status":"","category":"","assign":""}';
//console.log(data);

var ObjectId = require('mongodb').ObjectID;
let bugid = 0;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/bug/v1/saveuser', (req, res)=>{
    if (req.body !== undefined || req.body !== '') {
        //try {
            saveData(req.body);                           /*Save the user data to mongodb*/
            res.send({"status":"200","records": 1});
       /* }
        catch(err){
            res.send({"status":"400","error": err});
        }*/
        
    } else {
        res.send({"status": "404"});
    }
});


app.post('/bug/v1/savecategory', (req, res) =>{           /*Save the category to mongodb*/
    if(req.body !== undefined || req.body !==''){
        saveCategory(req.body);
        res.send({"status":"200", "records" : 1});
    }
    else {
        res.send({"status":"404"});
    }
});

app.post('/bug/v1/savestatus', (req,res) =>{            /*Save the status to mongodb*/
    if(req.body !== undefined || req.body !==''){
        saveStatus(req.body);
        res.send({"status":"200", "records" :1});
    }
    else {
        res.send({"status" : 404});
    }
});

app.post('/bug/v1/savebrowser',(req,res) =>{       /* Save the browse to monogdb */
    if(req.body !== undefined || req.body !==''){
        saveBrowser(req.body);
        res.send({"status":"200", "records" : 1});
    }
    else{
        res.send({"status": 404});
    }
});

app.post('/bug/v1/saveos', (req,res) =>{
    if(req.body !== undefined || req.body !== ''){
        saveOs(req.body);
        res.send({"status":"200","records": 1});
    }
    else
    {
        res.send({"status": 404});
    }
});

app.post('/bug/v1/savepriority', (req,res) =>{
    if(req.body !== undefined || req.body !== ''){
        savePriority(req.body);
        res.send({"status":"200","records": 1});
    }
    else
    {
        res.send({"status": 404});
    }
});

app.post('/bug/v1/savebug', (req,res) =>{
    if(req.body !== undefined || req.body !== ''){
        saveBug(req.body);
        res.send({"status" :"200", "records" : 1});
    }
    else
    {
        res.send({"status" : 404});
    }
});


app.get('/bug/v1/getusers', function(req, res){      /*API to get the user details*/
    ////console.log(req.body);
    //res.send({"status":"200"});
    getuser(res);
});

app.get('/bug/v1/getcategory', function(req, res){    /*API to get the category*/
    ////console.log(req.body);
    getcategory(res);

});

app.get('/bug/v1/getstatus', function(req,res){  /*API to get the status*/
    getstatus(res);
});

app.get('/bug/v1/getbrowser', function(req,res){   /*API to get the browser*/
    getbrowser(res);
});

app.get('/bug/v1/getos', function(req,res){   /*API to get the OS*/
    getos(res);
});

app.get('/bug/v1/getpriority', function(req,res){   /*API to get the priority*/
    getpriority(res);
});

app.get('/bug/v1/bugid', function(req,res){
    SequenceNumber(res);
  
});

app.post('/bug/v1/getrowcount/:collectionname',function(req,res){
    
    let json = req.body;
    console.log("%%%%%%%%%");
    console.log(req.body);
    if(json!== undefined || json!=='')
    {
        let mkey ;
        if (json.mkey !== undefined && json.mkey !== 'undefined'){
            mkey = json.mkey;
            console.log("--------------");
            console.log(mkey);
        } else {
            console.log("&&&&&&&&&&&&&");
            console.log(json)
        }
        console.log("********json********");
        console.log(json);
        console.log("*****mkey*****");
        console.log(mkey);
        let ljson = generateQuery2(json,mkey)
        console.log(ljson);
        var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
        var lcollectionname = req.params.collectionname;
        
        
        MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
            if(err) throw err;
            console.log("****ljson****");
            console.log(ljson);
            db.collection(lcollectionname).find(ljson).count( function(err, count){
                if(err) throw err;
                db.close();
                console.log("Count : ----"+ count);
                res.send({"row":count});
            });
        });
    }
    else{
            res.send({"status" :404})
    
    }

});

app.post('/bug/v1/getbug', function(req,res){
    console.log(req.body.dcoid);
    if(req.body.docid !== undefined && req.body.docid !== '')
     {
        console.log(req.body.docid);
        console.log(req.body.action);
        getBug(res, req.body.docid,req.body.action);
     }
     else{

         getBug(res,'');
     }
});

app.post('/bug/v1/usercount',function(req,res){      /*API to count the number of user count*/
    ////console.log(req.body);
    isUserunique(req.body.userid, req.body.id, res);
});

app.post('/bug/v1/categorycount', function(req, res){
    isCategoryunique(req.body.categoryname, req.body.id, res);
}); 

app.post('/bug/v1/statuscount', function(req,res){
    isStatusunique(req.body.statusname, req.body.id,res);
});

app.post('/bug/v1/browsercount/', function(req,res){
    ////console.log();
    isBrowserunique(req.body.browser, req.body.id, res);
});

app.post('/bug/v1/oscount/', function(req,res){
    isOsunique(req.body.os, req.body.id,res)
});

app.post('/bug/v1/prioritycount/', function(req,res){
    isPriorityunique(req.body.priority, req.body.id,res)
});

app.post('/bug/v1/bugcount/', function(req,res){
    isbugUnique(req.body.desc, req.body.id, res);
});

app.get('/bug/v1/deleteuser/:_id', function(req,res){     /* API to Delete the user*/
    deluser(req.params._id,res);
});

app.get('/bug/v1/deletecategory/:_id', function(req, res){
    deletecategory(req.params._id, res);
});

app.get('/bug/v1/deletestatus/:_id', function(req, res){
    deletestatus(req.params._id, res);
});

app.get('/bug/v1/deletebrowser/:_id', function(req,res){
    deletebrowser(req.params._id,res);
});

app.get('/bug/v1/deleteos/:_id', function(req,res){
    deleteos(req.params._id, res);
});

app.get('/bug/v1/deletepriority/:_id', function(req,res){
    deletepriority(req.params._id, res);
});

app.get('/bug/v1/deletebug/:_id', function(req,res){
    deletebug(req.params._id, res);
});


app.get('/bug/v1/getid/:_id/', function(req,res){     /*API to get the userid*/
    ////console.log(req.params._id);
    getuserid(req.params._id, res);                               
});

app.get('/bug/v1/getcategid/:_id', function(req,res){
    getcategoryid(req.params._id, res);
});

app.get('/bug/v1/getstatusid/:_id', function(req, res){
    getstatusid(req.params._id, res);
});

app.get('/bug/v1/getbrowserid/:_id', function(req,res){
    getbrowserid(req.params._id, res);
});

app.get('/bug/v1/getosid/:_id', function(req,res){
    getosid(req.params._id, res);
});

app.get('/bug/v1/getpriorityid/:_id', function(req,res){
    getpriorityid(req.params._id, res);
});

app.get('/bug/v1/getbugdetails/:_id', function(req,res){
   // updateBug(req.params._id, res, req.body);
   getBugDetails(req.params._id, res);
})

app.post('/bug/v1/edituser/:_id', function(req, res){    /*API to edit the user details*/
    updateUser(req.params._id,res,req.body);

});

app.post('/bug/v1/editcategory/:_id', function(req, res){
    updateCategory(req.params._id,res,req.body);
});

app.post('/bug/v1/editstatus/:_id', function(req,res){
    updateStatus(req.params._id, res, req.body);
});


app.post('/bug/v1/editbrowser/:_id', function(req,res){
    updateBrowser(req.params._id, res, req.body);
});

app.post('/bug/v1/editos/:_id', function(req,res){
    updateOs(req.params._id, res, req.body);
})

app.post('/bug/v1/editpriority/:_id', function(req,res){
    updatePriority(req.params._id, res, req.body);
});

app.post('/bug/v1/updatebug/:_id', function(req, res){
    updateBug(req.params._id, req.body,res);
    //console.log(req.body);
    //logDetails();
    //var json = req.body;
    //console.log(json);
});

app.get('/bug/v1/getmsg/:message_id', function(req,res){
    console.log(req.params.message_id);
    let status_code = req.params.message_id;
    if (status_code === undefined || status_code === '')
        res.send({"message" : ""});
    else {
        const msg = (data[status_code] === undefined ? '':data[status_code]) ;
        res.send({"message" : msg });
    }
});

app.post('/bug/v1/search', function(req,res){
    
    let Json = req.body;
    
    if(Json !== undefined || Json !== '')
    {
        let laction = Json.action;
        let ldocid = Json.docid;
        let ljson = generateQuery(Json,G_BUG_MASTER_JSON);

        var MongoClient = require('mongodb').MongoClient({useNewUrlParser:true});
        MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{   
        
            if(laction!== undefined && laction!== '' && ldocid !== undefined && ldocid !== '' )
            {
                //if(err) res.send({'status':'404'});
                    if(laction == 'next')
                    {
                        //console.log('ssss');
                        //Json = {'_id': {'$gt': ObjectId(pdocid)},"bugid": Json.bugid,"category":Json.category,
                                                       // "assign" : Json.assign,"status":Json.status};
                        ljson["_id"] = {'$gt': ObjectId(ldocid)};
                        //ljson = {'_id': {'$gt': ObjectId(ldocid)}, ljson};
                        console.log(ljson);
                        db.collection("bug").find(ljson).limit(10).toArray(function(err,result){
                            if(err) throw err;
                            db.close(); 
                            res.send(result);
                        });
                    } 
                    else if (laction == 'prev')
                    {
                        //Json = {'_id': {'$lt': ObjectId(pdocid)},"bugid": Json.bugid,"category":Json.category,
                                                                //"assign" : Json.assign,"status":Json.status};
                        //console.log(paction);
                        //console.log('next');
                        ljson["_id"] = {'$lt': ObjectId(ldocid)};
                        console.log(ljson);
                        db.collection("bug").find(ljson).sort({"_id" : -1}).limit(10).toArray(function(err,result){
                            if(err) throw err;
                            db.close(); 
                            res.send(result);
                        });
                    } 
            }    
            else{
                db.collection("bug").find(ljson).limit(10).toArray(function(err,result){
                    if(err) throw err;
                    db.close(); 
                    res.send(result);
                });
            }
        
        }); 
        
    }
    else
    {
        res.send({'status':'404'});
    }

});


/*
    GenerateQuery is used for building the JSON Query for Mongo Collection filtering. 
    Jsonobj : Pass the JSON with filter data 
    pMasterJson : Master JSON is the collection's JSON with empty data and keys which should be part of output JSON 
    example : 
        generateQuery({"bugid":90,"category":"test","status":"open"},{"bugid":"","status":""})
        output : {"bugid":90,"status":"open"}
*/
function generateQuery(Jsonobj,pMasterJson)
{
    //var Jsonobj = JSON.parse(Json);
    
    
    //var bug = ;
    
    var bugobj = JSON.parse(pMasterJson);
    var ljson = '';
    //console.log(bugobj)
    //console.log('bugobj')
    //var flag = true;
    
    for(var i in Jsonobj)
    {   
        //console.log(i);
        //console.log(Jsonobj);
        for(var j in bugobj )
        {
            //console.log(i+'==='+j)
            if(i === j && Jsonobj[i] !== "")
            {
                //console.log("pass");
                //form the JSON string here
                //console.log(i);
                ljson += '"'+i +'":"'+Jsonobj[i]+'",';
                //console.log(ljson);
            }     
            
        }
    
    }
    ljson = ljson.replace(/,\s*$/, "");
    //console.log(ljson);
    var string = JSON.parse('{'+ljson+'}');
    console.log(string);
    return string;
}

//console.log(generateQuery2({"bugid":10,"category":"new"},["bugid","category"]));

function generateQuery2(Jsonobj,pMasterJson)
{
    //var bugobj = JSON.parse(pMasterJson);
    var ljson = '';
    for(var i in Jsonobj)
    {   
        for(var j = 0; j < pMasterJson.length ; j++ )
        {
            if(pMasterJson[j] === i && Jsonobj[i] !== "")
            {
                ljson += '"'+i +'":"'+Jsonobj[i]+'",';
            }     
        }
    }
    ljson = ljson.replace(/,\s*$/, "");
    var string = JSON.parse('{'+ljson+'}');
    console.log(string);
    return string;
}






/* Function to Check user unique */

function isUserunique(puserid,pid,presp)
{
 var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
 let lCondition = {"userid":puserid};
 if ( pid !== ''){ //Edit mode
    lCondition = {_id :{$ne : ObjectId(pid)}, "userid" : puserid };
 } 
 ////console.log(puserid);
 ////console.log(lCondition);
 MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
     if(err) throw err;

     db.collection('user').find(lCondition).count( function(err, count){
        if(err) throw err;
        db.close();
        presp.send( {"count":count});
    });

 });

}

/* Function to check category unique */

function isCategoryunique(pcategory,pid,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser:true});
    let lCondition = {"categoryname":pcategory};
    if(pid !== ''){
        lCondition = {_id :{$ne : ObjectId(pid)}, "categoryname" : pcategory };
    }
    ////console.log(lCondition);
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
        if(err) throw err;

        db.collection('category').find(lCondition).count( function(err, count){
            if(err) throw err;
            db.close();
            presp.send({"count":count});
        })
    })
}

/* Function to check status unique */

function isStatusunique(pstatus,pid,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser:true});
    let lCondition = {"statusname":pstatus};
    if(pid !== ''){
        lCondition = {_id :{$ne : ObjectId(pid)}, "statusname" : pstatus};
    }
    ////console.log(lCondition);
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
        if(err) throw err;

        db.collection('status').find(lCondition).count( function(err, count){
            if(err) throw err;
            db.close();
            presp.send({"count":count});
        });
    });

}

function isBrowserunique(pbrowser,pid,presp)  /* Function to check browser unique */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    let lCondition = {"browser": pbrowser};
    if (pid !== ''){
        lCondition = {_id : {$ne : ObjectId(pid)},"browser": pbrowser};
    }
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;

        db.collection('browser').find(lCondition).count(function(err, count){
            if(err) throw err;
            db.close();
            presp.send({"count": count});
        });
    });
}

function isOsunique(pos,pid,presp)  /* Function to check OS unique */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    let lCondition = {"os": pos};
    if (pid !== ''){
        lCondition = {_id : {$ne : ObjectId(pid)},"os": pos};
    }
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;

        db.collection('os').find(lCondition).count(function(err, count){
            if(err) throw err;
            db.close();
            presp.send({"count": count});
        });
    });
}

function isPriorityunique(lpriority,pid,presp)  /* Function to check priority unique */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    let lCondition = {"priority": lpriority};
    if (pid !== ''){
        lCondition = {_id : {$ne : ObjectId(pid)},"priority": lpriority};
    }
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;

        db.collection('priority').find(lCondition).count(function(err, count){
            if(err) throw err;
            db.close();
            presp.send({"count": count});
        });
    });

}

function isbugUnique(pdesc, pid, presp)
{
    ////console.log(pdesc);
    ////console.log(pid);
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    let lCondition = {"desc": pdesc};
    if (pid !== ''){
        lCondition = {_id : {$ne : ObjectId(pid)},"desc": pdesc};
    }
    
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;

        db.collection('bug').find(lCondition).count(function(err, count){
            if(err) throw err;
            ////console.log(count);
            db.close();
            presp.send({"count": count});
            
        });
    });


}




/* Function to  Save user records */

function saveData(pdata)
{
    var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});

MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
        if(err) throw err;
        db.collection('user', function(err, collection){
            if(err) throw err;
            collection.insert(pdata);
            db.collection('user').count(function(err, count){
                if(err) throw err;
                db.close();
                return count;
            });
        
        });
    });
}

function saveCategory(pdata)      /* Function to Save cateogry records */
{
    var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
    if(err) throw err;
    db.collection('category', function(err, collection){
        if(err) throw err;
        collection.insert(pdata);
        db.collection('category').count(function(err, count){
            if(err) throw err;
            db.close();
            return count;
        });
    });
});
}

function saveStatus(pdata)  /* Function to save status records*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser:true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
    if(err) throw err;
    db.collection('status', function(err, collection){
        if(err) throw err;
        collection.insert(pdata);
        db.collection("status").count(function(err, count){
            if(err) throw err;
            db.close()
            return count;
        });
    });
});
}

function saveBrowser(pdata)    /* Function to save browser records*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
        if(err) throw err;
        db.collection('browser', function(err, collection){
            if(err) throw err;
            collection.insert(pdata);
            db.collection('browser').count(function(err, count){
                if(err) throw err;
                db.close();
                return count;
            });
        });
    });
}

function saveOs(pdata)  /* Function to save OS records*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;
        db.collection('os' , function(err, collection){
            if(err) throw err;
            collection.insert(pdata);
            db.collection('os').count(function(err,count){
                if(err) throw err;
                db.close();
                return count;
            });
        });
    });
}

function savePriority(pdata)  /* Function to save priority records*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;
        db.collection('priority' , function(err, collection){
            if(err) throw err;
            collection.insert(pdata);
            db.collection('priority').count(function(err,count){
                if(err) throw err;
                db.close();
                return count;
            });
        });
    });
}

function saveBug(pseq)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});


        MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
            if(err) throw err;
            db.collection('bug', function(err,collection){
            if(err) throw err;
                collection.insert(pseq);
                db.collection('bug').count(function(err,count){
                if(err) throw err;
                return count;
                
            });
        });
    });
}

function SequenceNumber(presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;
        db.collection('seq', function(err,collection){
            if(err) throw err;
            db.collection("seq").findOne({},function(err,result){
                ////console.log(result);
                let nextval = result.curval + 1;
                
                db.collection("seq").update({},{"curval" : nextval}, function(err, result){
                    if(err)
                    {

                        db.close();
                        throw err;
                    }
                    db.close();
                    presp.send({"nextval" : nextval});
                });
                

            });
        });
    });
    
}

app.listen(PORT,function(request, response) {
    console.log(`Server is listening at ${PORT} `);
});

/* Function to get the user details */

function getuser(resp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{
        if(err) resp.send({'status':'404'});
        db.collection("user").find({}).toArray(function(err, result){
            if(err) resp.send({'status':'404'});
            db.close(); 
            resp.send(result);
            
        });
    });
}

function getcategory(resp)   /* function to get category */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{
        if(err) resp.send({'status':'404'});
        db.collection("category").find({}).toArray(function(err,result){
            if(err) resp.send({'status':'404'});
            db.close(); 
            resp.send(result);
        });
    });
}
 function getstatus(resp)  /* function to get status */
 {
     var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
     MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db)=>{
        if(err) resp.send({'status' :'404'});
        db.collection("status").find({}).toArray(function(err, result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
     });
}

function getbrowser(resp)  /* function to get browser*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err, db)=>{
        if(err) resp.send({'status' : '404'});
        db.collection("browser").find({}).toArray(function(err, result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });
}

function getos(resp)   /* function to get OS*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{
        if(err) resp.send({'status':'404'});
        db.collection("os").find({}).toArray(function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });
}

function getpriority(resp)  /* function to get priority */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{
        if(err) resp.send({'status':'404'});
        db.collection("priority").find({}).toArray(function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });

}

function getBug(resp,pdocid,paction)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{
        ////console.log(err);
        if(err) resp.send({'status':'404'});
        if ( pdocid === ''){
            db.collection("bug").find().limit(10)
            .toArray(function(err,result){
                if(err) throw err;
                db.close(); 
                resp.send(result);
            });
        } else if(paction == 'prev'){
            console.log(pdocid+'ssss');
            let json = {'_id': {'$lt': ObjectId(pdocid)}};
            console.log(json);
            console.log('jsonssss');
            db.collection("bug").find(json).sort({'_id': -1}).limit(10)
            .toArray(function(err,result){
                if(err) throw err;
                db.close(); 
                resp.send(result);
            });
        } else{
            let json = {'_id': {'$gt': ObjectId(pdocid)}};
            console.log(pdocid);
            console.log('ssnext');

            db.collection("bug").find(json).limit(10)
            .toArray(function(err,result){
                if(err) throw err;
                db.close(); 
                resp.send(result);
            });
        }

    });
}



/*Function to  delete the user */

function deluser(puserid,resp)
{
    ////console.log(puserid);
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{
        
    db.collection("user").deleteOne({"_id": ObjectId(puserid)} ,function(err, result){
        if (err) throw err;
            ////console.log("1 document deleted");
            db.close(); 
            resp.send({"result":result});
        });
    });

}

function deletecategory(pcategoryId, resp)   /*function to delete category */
{
    
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{
    
    //console.log(pcategoryId)
    db.collection("category").deleteOne({"_id": ObjectId(pcategoryId)} ,function(err, result){
        if (err) throw err;
            //console.log("1 document deleted");
            db.close(); 
            resp.send({"result":result});
    
        });
    });
}

function deletestatus(pstatusId, resp)   /*function to delete status*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{
    
    //console.log(pstatusId)
    db.collection("status").deleteOne({"_id": ObjectId(pstatusId)} ,function(err, result){
        if (err) throw err;
            //console.log("1 document deleted");
            db.close(); 
            resp.send({"result":result});
        });
    });

}

function deletebrowser(pbrowserid, resp)   /*function to delete browser */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{

    db.collection("browser").deleteOne({"_id": ObjectId(pbrowserid)}, function(err, result){
        if(err) throw err;
            //console.log("1 document deleted");
            db.close(); 
            resp.send({"result":result});
        });
    });

}

function deleteos(posid, resp)   /*function to delete OS*/
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{

    db.collection("os").deleteOne({"_id":
     ObjectId(posid)}, function(err, result){
        if(err) throw err;
            //console.log("1 document deleted");
            db.close(); 
            resp.send({"result":result});
            
        });
    });

}

function deletepriority(lpriorityid, resp)  /*function to delete priority */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{

    db.collection("priority").deleteOne({"_id": ObjectId(lpriorityid)}, function(err, result){
        if(err) throw err;
            //console.log("1 document deleted");
            db.close(); 
            resp.send({"result":result});
        });
    });

}

function deletebug(pbugid, resp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{

    db.collection("bug").deleteOne({"_id": ObjectId(pbugid)}, function(err,result){
        if(err) throw err;
            //console.log("1 records deleted");
            db.close(); 
            resp.send({"result":result});
        });
    });
}


/* Function to get the userid */
function getuserid(puserid,resp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{
        
        db.collection("user").find({"_id": ObjectId(puserid)}).toArray( function(err, result){
            if(err) throw err;
            //console.log(result);
            db.close(); 
            resp.send(result);
        });
    })
}

function getcategoryid(pcategid, resp)   /*Get category id */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser: true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{

    db.collection("category").find({"_id": ObjectId(pcategid)}).toArray(function(err, result){
        if(err) throw err;
        db.close(); 
        resp.send(result);
    });
});
}

function getstatusid(pstatusid, resp)    /*Get status id */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser: true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{

    db.collection("status").find({"_id": ObjectId(pstatusid)}).toArray(function(err, result){
        if(err) throw err;
        db.close(); 
        resp.send(result);
    });
});

}

function getbrowserid(pbrowserid, resp)    /*Get browser id */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err, db)=>{
        
    db.collection("browser").find({"_id": ObjectId(pbrowserid)}).toArray(function(err, result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });
}

function getosid(posid, resp)   /*Get OS id */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{

        db.collection("os").find({"_id": ObjectId(posid)}).toArray(function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });
}

function getpriorityid(lpriority, resp)   /*Get priority id */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{

        db.collection("priority").find({"_id": ObjectId(lpriority)}).toArray(function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);

        });
    });

}

function getBugDetails(pbugid, resp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
    //console.log("gbjjjjjkjk")
    //console.log(pbugid);
        db.collection("bug").find({"_id": ObjectId(pbugid)}).toArray(function(err,result){
            if(err) throw err;
            ////console.log(result);
            //console.log("ssssss");
            db.close(); 
            resp.send(result);
        });
    });

}

/* Function to Update the user details */

function updateUser(pupdateID,resp,pJSON)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{

        db.collection("user").update({"_id": ObjectId(pupdateID)}, pJSON, function(err, result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        
        });
    });
}

function updateCategory(pcategID,resp,pJSON)   /*Update the category */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
        
    //console.log(pcategID);
        db.collection("category").update({"_id": ObjectId(pcategID)}, pJSON, function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });
}
 
function updateStatus(pstatusId, resp,pJSON)   /*Update the status */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
        
    //console.log(pstatusId);
        db.collection("status").update({"_id": ObjectId(pstatusId)}, pJSON, function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });

}

function updateBrowser(pbrowserId, resp,pJSON)  /*Update the browser  */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
        
    //console.log(pbrowserId);
        db.collection("browser").update({"_id": ObjectId(pbrowserId)}, pJSON, function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
        });
    });
}

function updateOs(posid, resp, pJSON)   /*Update the OS */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
        
    //console.log(posid);
        db.collection("os").update({"_id": ObjectId(posid)}, pJSON, function(err,result){
            if(err) throw err;
            db.close(); 
            resp.send(result);
           
        });
    });

}

function updatePriority(lpriority, resp, pJSON)  /*Update the priority */
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
        
    //console.log(lpriority);
        db.collection("priority").update({"_id": ObjectId(lpriority)}, pJSON, function(err,result){
            if(err) throw err;
            db.close();
            resp.send(result); 
        });
    });

}

function updateBug(pbugid,pJSON,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

        MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{
            
            db.collection("bug").update({"_id": ObjectId(pbugid)},pJSON, function(err,result){
                if(pJSON.prev_status != pJSON.new_status)
                {
                    //var lJSON = pJSON;
                    pJSON["status"] = "STATUS_CHANGE";
                    pJSON["message"] = data.STATUS_CHANGE_MSG;
                    //logDetails(pJSON,presp);
                    //presp.send({"msgcode" : "STATUS_CHANGED"});

                    //resp.send(data.STATUS_CHANGE);
                    
                }

               else 
                {
                    if(err) throw err;
                    db.close();
                    presp.send({"msgcode" : "BUG_UPDATED"});
                }
            
     
            });
        });
}


/*function search(pword,resp){
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local", (err,db) =>{
        db.collection("bug").find({"status" : pword}).toArray(function(err,result){
            if(err) throw err;
            ////console.log(result);
            //console.log("ssssss");
            db.close();
            resp.send(result);
        });
    });
}*/

/*function logDetails(pJSON,presp)
{
    //console.log("*****");
    //console.log(pJSON);
    
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});   

    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{
        if(err) throw err;

        db.collection('log', function (err, collection){
            if(err) throw err; 
            let newstatus = pJSON.new_status;
            let oldstatus = pJSON.prev_status;
         //   let newuser = pJSON.new_assign;
         //   let olduser = pJSON.prev_assign;
            
            collection.insert({"log_type" : "bug" , "ID" : pJSON.bugid,"log_date" : pJSON.created, "old_value" : pJSON.prev_status,"new_value" : pJSON.new_status, "status" : pJSON.status, "message": eval(pJSON.message),
                                "old_value" : pJSON.prev_assign,"new_value" : pJSON.new_assign,"assign_message": eval(pJSON.assign_message)});
            
            
            db.collection("log").count(function(err,result){
                if(err) throw err;
                db.close();

                if(pJSON.prev_assign != pJSON.new_assign)
                {
                    pJSON["prev_status"] = pJSON.prev_assign;
                    pJSON["new_status"] = pJSON.new_assign;
                    pJSON["assign"] = "ASSIGN_CHANGE";
                    pJSON["assignmessage"] = data.ASSIGN_CHANGE_MSG;
                    //logDetails(pJSON,presp);
                    
                    collection.insert({"log_type" : "bug" , "ID" : pJSON.bugid,"log_date" : pJSON.created, "old_value" : pJSON.prev_status,"new_value" : pJSON.new_status, "status" : pJSON.status, "message": eval(pJSON.message),
                                    "old_value" : pJSON.prev_assign,"new_value" : pJSON.new_assign,"assign_message": eval(pJSON.assign_message)});


                } else
                presp.send({"msgcode" : "STATUS_CHANGED"});
                //return result;
            });
        });
    });
}*/




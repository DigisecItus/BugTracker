"use strict";
let express = require('express'), app = express(), bodyParser = require('body-parser'), crypto = require('crypto');
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
    
    let json = req.body;
    
    console.log(json);
    if (json !== undefined || json !== '') 
    {
        var pwd = req.body.password;
       
        var mystr = encrypt(pwd);
        //console.log(mystr);
        json["password"] = mystr;
        //console.log(json);
        
        var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
        
        MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
                if(err) throw err;
                db.collection('user', function(err, collection){
                    if(err) throw err;
                    collection.insert(json);
                    db.collection('user').count(function(err, count){
                        if(err) throw err;
                        db.close();
                        res.send({"status":200})
                    });
                
                });
            });
    } else 
    {
        res.send({"status": "404"});
    }
});





app.post('/bug/v1/login', (req,res)=>{
    //let strJSON = JSON.stringify(req.body);
    //console.log(strJSON);
    //let newJSON = JSON.parse(strJSON);
    console.log(req.body);
    
    if (req.body!== undefined || req.body!== '') 
    {
        var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
    
        MongoClient.connect("mongodb://" +IP+ ":27017/local",function(err,db){
            //if(err) throw err;
            console.log(req.body);
            
            db.collection("user").findOne({ userid: req.body.userid},function(err,user){
                console.log('user found');
                //console.log(user);
                var pwd = decrypt(user.password);
                console.log(pwd);
                if(err) 
                {
                    console.log('This is error');
                    db.close();
                    res.send({"status":"404"});
                } 
                if (user && pwd === req.body.password)
                {
                    console.log('User and password is correct');
                    db.close();
                    //res.redirect('/bug/v1/savebug');
                    res.send({"status":"200"});
                } else {
                    console.log("Credentials wrong");
                    db.close();
                    res.send({"status": "404"});
                  }        
            });
        });
    }
    else
        res.send({"status": "404"});

});

function encrypt(data) {
    var cipher = crypto.createCipher('aes-256-ecb', 'password');
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(data) {
    var cipher = crypto.createDecipher('aes-256-ecb', 'password');
    return cipher.update(data, 'hex', 'utf8') + cipher.final('utf8');
}



/*app.post('/bug/v1/auth', (req,res)=>{

    if(req.body !== undefined || req.body !=='')
    {
        
        
        
        
        var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
        
        MongoClient.connect("mongodb://" +IP+ ":27017/local",function(err,db){
            
            console.log(req.body);
                db.collection('groups',function(err,collection){
                    if(err)throw err;
                    collection.insert(json);
                
                db.collection('groups').count(function(err, count){
                    if(err) throw err;
                    db.close();
                    res.send({"send":"200"})
                });

            
            
            });
            
        });

    }

});*/




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

app.post('/bug/v1/getrowcount/:collectionname',function(req,res){   /*Created a generic collectionName for row Count*/
    
    let json = req.body;
    //console.log("%%%%%%%%%");
    console.log(req.body);
    if(json!== undefined || json!=='')
    {
        let mkey ;
        if (json["mkey[]"] !== undefined && json["mkey[]"] !== 'undefined'){
            mkey = json["mkey[]"];
            console.log("--------------");
            console.log(mkey);
        } else {
            console.log("&&&&&&&&&&&&&");
            console.log(json)
        }
        //console.log("********json********");
        //console.log(json);
        //console.log("*****mkey*****");
        console.log(mkey);
        let ljson = generateQuery2(json,mkey)
        console.log("ljson");
        console.log(ljson);
       
        var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
        var lcollectionname = req.params.collectionname;
        
        
        MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
            if(err) throw err;
            //console.log("****ljson****");
            //console.log(ljson);
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


app.get('/bug/v1/deletestatus/:_id', function(req, res){
    deletestatus(req.params._id, res);
});

app.get('/bug/v1/deletebrowser/:_id', function(req,res){
    deletebrowser(req.params._id,res);
});

app.get('/bug/v1/deleteos/:_id', function(req,res){
    deleteos(req.params._id, res);
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
                if(laction == 'next')
                    {
                        ljson["_id"] = {'$gt': ObjectId(ldocid)};
                        db.collection("bug").find(ljson).limit(10).toArray(function(err,result){
                            if(err) throw err;
                            db.close(); 
                            res.send(result);
                        });
                    } 
                    else if (laction == 'prev')
                    {
                        
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
                console.log("*****")
                console.log(ljson);
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
    console.log(typeof pMasterJson);
    var ljson = '';
    for(var i in Jsonobj)
    {   
        for(var j in pMasterJson )
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
 let lCondition = {"userid":{'$regex': '^'+puserid+'$',$options:'i'}};
 if ( pid !== ''){ //Edit mode
    //lCondition = {_id :{$ne : ObjectId(pid)}, "userid" : puserid };
    lCondition = {_id: {$ne : ObjectId(pid)},"userid": {'$regex': '^'+puserid+'$',$options:'i'}}
 } 
 
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
    let lCondition = {"categoryname": {'$regex': '^'+pcategory+'$',$options:'i'}};
    console.log(pid);
    console.log("before condition")  
    if(pid !== ''){   /*Edit mode */

        console.log(pid);
        console.log("after condition")
        lCondition = {_id :{$ne : ObjectId(pid)}, "categoryname": {'$regex': '^'+pcategory+'$',$options:'i'} };
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
    let lCondition = {"statusname": {'$regex': '^'+pstatus+'$',$options:'i'}}; 
    if(pid !== ''){/*edit  mode*/
        lCondition = {_id :{$ne : ObjectId(pid)},"statusname": {'$regex': '^'+pstatus+'$',$options:'i'}};
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
    let lCondition = {"browser": {'$regex': '^'+pbrowser+'$',$options:'i'}};
    if (pid !== ''){/*edit mode*/
        lCondition = {_id : {$ne : ObjectId(pid)},"browser": {'$regex': '^'+pbrowser+'$',$options:'i'}};
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
    let lCondition = {"os": {'$regex': '^'+pos+'$',$options:'i'}};
    if (pid !== ''){/*Edit mode*/
        lCondition = {_id : {$ne : ObjectId(pid)},"os": {'$regex': '^'+pos+'$',$options:'i'}};
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
    let lCondition = {"priority": {'$regex': '^'+lpriority+'$',$options:'i'}}; 
    if (pid !== ''){/*Edit mode */
        lCondition = {_id : {$ne : ObjectId(pid)},"priority": {'$regex': '^'+lpriority+'$',$options:'i'}};
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
    let lCondition = {"desc": {'$regex': '^'+pdesc+'$',$options:'i'}}; 
    if (pid !== ''){ /*edit mode */
        lCondition = {_id : {$ne : ObjectId(pid)}, "desc": {'$regex': '^'+pdesc+'$',$options:'i'}};
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
        if (pdocid === '' || paction === ''){
            db.collection("bug").find().limit(10).toArray(function(err,result){
                if(err) throw err;
                db.close(); 
                resp.send(result);
            });
        } else if(paction == 'prev')
        {
            let json = {'_id': {'$lt': ObjectId(pdocid)}};
            db.collection("bug").find(json).sort({'_id': -1}).limit(10).toArray(function(err,result){
                if(err) throw err;
                db.close(); 
                resp.send(result);
            });
        } else
        {
            let json = {'_id': {'$gt': ObjectId(pdocid)}};
            db.collection("bug").find(json).limit(10).toArray(function(err,result){
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



/*function to delete category */
app.post('/bug/v1/deletecategory/:_id', function(req, res){

    let categoryname = req.body;
    
    let pcategoryId = req.params._id;
    
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{

        db.collection('bug').find(categoryname).toArray(function(err,count){
            if(err)throw err;
            if(count == 0)
            {
                db.collection("category").deleteOne({"_id": ObjectId(pcategoryId)} ,function(err, result){
                    if (err) throw err;
                    db.close(); 
                    res.send({"status":400});
                });
            }
            else{
                    db.close(); 
                    res.send({"status":200});
                }
            })
    });

});

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

/*function to delete priority */
app.post('/bug/v1/deletepriority/:_id', function(req,res){
    

    let lpriorityid = req.params._id;
    let priorityname = req.body;
    
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db) =>{

        db.collection('bug').find(priorityname).toArray(function(err,count){
            if(err)throw err;
            if(count == 0)
            {
                db.collection("priority").deleteOne({"_id": ObjectId(lpriorityid)}, function(err, result){
                    if(err) throw err;
                    db.close(); 
                    res.send({"status":400});
                });
            }
            else
            {
                db.close(); 
                res.send({"status":200});
            }
        });
    });

});

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
    let ljson = {"firstname":pJSON.firstname,"lastname":pJSON.lastname,"userid":pJSON.userid};
    console.log(ljson);
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{

        db.collection("user").update({"_id": ObjectId(pupdateID)},{$set:ljson}, function(err, result){
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

app.post('/bug/v1/moduleexist',function(req,res){      /*API to count the number of user count*/
    ////console.log(req.body);
    moduleexist(req.body.module_name, req.body.id, res);
});

function moduleexist(pmodule_name,pid,presp)
{
    var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});

    let lCondition = {"module_name": {'$regex': '^'+pmodule_name+'$',$options:'i' }};
    if(pid !== ''){/*edit mode */
        console.log("pid has value");
        //lCondition = {_id :{$ne : ObjectId(pid)}, "module_name" : pmodule_name };
        lCondition = {_id: {$ne : ObjectId(pid)},"module_name": {'$regex': '^'+pmodule_name+'$',$options:'i'}};
    }
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;

        db.collection('module').find(lCondition).count( function(err, count){
            if(err) throw err;
            db.close();
            console.log("count of module"+count);
            presp.send( {"count":count});
        });
    });

}

app.post('/bug/v1/addmodule',(req,res)=>{

    let json = req.body;
    
    if (json!== undefined && json!== '') 
    {
        console.log(json);
        var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});
        
        MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err, db){
            if(err) throw err;
            db.collection('module', function(err, collection){
                if(err) throw err;
                collection.insert(json);
                    db.collection('module').count(function(err, count){
                        if(err) throw err;
                        db.close();
                        res.send({"status":200})
                    });
                });
        });
    }
    else 
    {
        res.send({"status":400});
    }
});

app.post('/bug/v1/updatemodule/:id', function(req, res){
    updatemodule(req.params.id,req.body,res);
});



function updatemodule(pmoduleid,pjson,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{

        db.collection("module").update({"_id": ObjectId(pmoduleid)}, pjson, function(err,result){
            if(err) throw err;
            db.close(); 
            presp.send(result);
        
        });
    });
}

app.post('/bug/v1/deletemodule/:id', function(req,res){


    let modules = req.body;

    let moduleid = req.params.id; 
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{

        db.collection('groups').find(modules).count(function(err,count){
            if(err)throw err;
            console.log("count"+count);
            console.log(modules);
            if(count == 0)
            {
                db.collection("module").deleteOne({"_id": ObjectId(moduleid)} ,function(err, result){
                    if (err) throw err;
                    db.close(); 
                    res.send({"status" : 400});
                });
            }
            else
            {
                db.close();
                res.send({"status" : 200});
            }

        })
    })
});

app.get('/bug/v1/getmoduleid/:id',(req,res)=>{
    if(req.body !== undefined && req.body !=='')
    {
        getmoduleid(req.params.id,res);
    }
    else{
        res.send({"status":400})
    }
});

function getmoduleid(pmoduleid,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{
        if(err) throw err;
        db.collection('module').find({"_id": ObjectId(pmoduleid)}).toArray(function(err, result){
            if(err) throw err;
            db.close(); 
            presp.send(result);
        });
    });
}

app.get('/bug/v1/getmodule',(req,res)=>{
    if(req.body !== undefined && req.body !=='')
    {
        getmodule(res);
    }
    else{
        res.send({"status":400})
    }
})


function getmodule(presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db)=>{
        if(err) throw err;
         db.collection('module').find({}).toArray(function(err,result){
            if(err) throw err;
            db.close(); 
             presp.send(result);
        });
    });

}
    


app.post('/bug/v1/addgroups',(req,res)=>{
    
    let json = req.body;
    console.log(json);

    if(json !== undefined || json!== '')
    {

        var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

        MongoClient.connect("mongodb://" +IP+ ":27017/local",(err,db)=>{
            if(err) throw err;
            
            db.collection('groups',function(err,collection){
                if(err) throw err;
                
                collection.insert(json);
                
                db.collection('groups').count(function(err, count){
                    if(err) throw err;
                    db.close();
                    res.send({"status":200})
                });

            });

        });
    }
    else
    {
        res.send({"status":400})
    }

});
app.post('/bug/v1/groupsexist',function(req,res){      /*API to count the number of user count*/
    ////console.log(req.body);
    groupexist(req.body.group_name,req.body.checkModule, req.body.id, res);
});



function groupexist(pgroup_name,pcheckModule,pid,presp)
{
    var MongoClient = require('mongodb').MongoClient({ useNewUrlParser: true});

    let lCondition = {"group_name": {'$regex': '^'+pgroup_name+'$',$options:'i'},"checkModule":pcheckModule};
    if(pid !== ''){/*Edit mode*/
        lCondition = {_id :{$ne : ObjectId(pid)}, "group_name": {'$regex': '^'+pgroup_name+'$',$options:'i'},"checkModule":pcheckModule};
    }
    
    MongoClient.connect("mongodb://" +IP+ ":27017/local", function(err,db){
        if(err) throw err;

        db.collection('groups').find(lCondition).count( function(err, count){
            if(err) throw err;
            db.close();
            presp.send( {"count":count});
        });
    });

}

app.post('/bug/v1/updategroups/:id', function(req, res){
    updategroup(req.params.id,req.body,res);
});



function updategroup(pid,pjson,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    
    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{
        
        db.collection('groups').update({"_id": ObjectId(pid)}, pjson, function(err, result){
            if(err) throw err;
            db.close(); 
            presp.send(result);
        
        });
    });
}

app.post('/bug/v1/deletegroups/:id',(req,res)=>{

    let groups = req.body;
    let groupsid = req.params.id
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    
    MongoClient.connect("mongodb://" +IP+ ":27017/local",(err, db)=>{
        
        db.collection('user').find(groups).count(function(err,count){
            if(err)throw err;
            if(count == 0)
            {
                db.collection('groups').deleteOne({"_id": ObjectId(groupsid)} ,function(err, result){
                    if (err) throw err;
                    db.close(); 
                    res.send({"status":400});
                });
            }
            else{
                db.close();
                res.send({"status":200})
            }
        })
    });
    
});

app.get('/bug/v1/getgroups',(req,res)=>{
    if(req.body !== undefined && req.body !=='')
    {
        getgroup(res);
    }
    else{
        res.send({"status":400})
    }
});


function getgroup(presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});

    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{
        if(err) throw err;
        db.collection('groups').find({}).toArray(function(err, result){
            if(err) throw err;
            db.close(); 
            presp.send(result);
        });
    });
}


app.get('/bug/v1/getgroupid/:id',(req,res)=>{
    if(req.body !== undefined && req.body !=='')
    {
        getgroupid(req.params.id,res);
    }
    else{
        res.send({"status":400})
    }
});

function getgroupid(pgroupid,presp)
{
    var MongoClient = require('mongodb').MongoClient({useNewUrlParser : true});
    //console.log(pgroupid);

    MongoClient.connect("mongodb://" +IP+ ":27017/local" , (err, db)=>{
        if(err) throw err;
        db.collection('groups').find({"_id": ObjectId(pgroupid)}).toArray(function(err, result){
            if(err) throw err;
            db.close(); 
            presp.send(result);
        });
    });
}


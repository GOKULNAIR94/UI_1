
var http = require('http');
var fs = require('fs'),
express = require('express'),
path = require('path');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', onRequest);
app.use(express.static(path.join(__dirname, 'public')));

function onRequest(request, response){
  //express.static(path.join(__dirname, 'public'));
  response.sendFile(path.join(__dirname, 'public/index.html'));
}


var varAuth = 'Basic YWthc2hkZWVwQGxudExOVDJLMTZfMQ==';
var varHost = 'acs.crm.ap2.oraclecloud.com';
var varPath = '/salesApi/resources/latest/Test_anu_c';
const https = require('https');

app.get('/main',function(request,response){
          var options = {
          host: varHost,
          path: varPath,
          headers: {
          'Authorization': varAuth,
          'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
        }   
      };
      var responseObject;
      var r = https.get(options, function(res){
      var body = "";

        res.on('data', function(data) {
          body += data;
        });
        res.on('end', function() {          
            console.log("Body : " +body);
            //responseObject = JSON.parse(body);
            //response.json(responseObject);
            //console.log(responseObject);

        })
        }).on('error', function(e){
      console.error(e);
  });
});

app.get('/editrecord/:id',function(request,response){
    var responseObject = [];
    var id = request.params.id;

        var options = {
        host: varHost,
        port: 443,
        path: varPath +id,
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }   
    };
    var r = https.get(options, function(res){
    var body = "";

      res.on('data', function(data) {
        body += data;
      });
      res.on('end', function() {
        debugger;
        responseObject[0] = JSON.parse(body);
        //console.log(responseObject[0]);

        var childoptions = {
        host: varHost,
        port: 443,
        path: varPath +id+ '/child/PromotionDatingProjectedCollection_c',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }   
    };
    var r = https.get(childoptions, function(res){
    var childObj = "";

      res.on('data', function(data) {
        childObj += data;
      });
      res.on('end', function() {
        debugger;
        responseObject[1] = JSON.parse(childObj);
        //console.log(responseObject[1]);
        response.json(responseObject);
      })
    }).on('error', function(e){
    console.error(e);
  });
      })
    }).on('error', function(e){
    console.error(e);
  });


});

app.post('/newrecord',function(request,response){
console.log('App . POST');
console.log('Req : '+ request.body.RecordName);

  var newoptions = {
        host: varHost,
        port: 443,
        path: '/salesApi/resources/latest/TitleMaster_c/',
        data:request.body,
        method:'POST',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(newoptions, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
            res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    post_req.write(JSON.stringify(request.body));
    post_req.end();
});

app.post('/newchild/:id',function(request,response){
var id = request.params.id;
console.log(id);
console.log('RecordName :');
console.log(request.body.RecordName);

  var newoptions = {
        host: varHost,
        port: 443,
        path: '/salesApi/resources/latest/TitleMaster_c/'+ id + '/child/ReleaseVersionCollection_c',
        data:request.body,
        method:'POST',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(newoptions, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
            res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    post_req.write(JSON.stringify(request.body));
    post_req.end();
});

/////////////Update Parent
app.post('/savep/:id',function(request,response){
var id = request.params.id;
console.log(id);
console.log('RecordName :');
console.log(request.body.RecordName);

  var options = {
        host: varHost,
        port: 443,
        path: '/salesApi/resources/latest/TitleMaster_c/'+ id ,
        data:request.body,
        method:'PUT',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(options, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
            res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    post_req.write(JSON.stringify(request.body));
    post_req.end();
});
//////////////Update end

/////////////Update Child
app.post('/savec/:pid/:cid',function(request,response){
var pid = request.params.pid,
cid = request.params.cid;
console.log(pid);
console.log(cid);
console.log('RecordName :');
console.log(request.body.RecordName);

  var options = {
        host: varHost,
        port: 443,
        path: '/salesApi/resources/latest/TitleMaster_c/'+ pid + '/child/ReleaseVersionCollection_c/' + cid,
        data:request.body,
        method:'PUT',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(options, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
            res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    post_req.write(JSON.stringify(request.body));
    post_req.end();
});
//////////////Update end

///////////////Delete Parent Start

app.post('/deletep/:pid',function(request,response){
var pid = request.params.pid;

  var options = {
        host: varHost,
        port: 443,
        path: '/salesApi/resources/latest/TitleMaster_c/'+ pid,
        data:request.body,
        method:'DELETE',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(options, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
            res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    //post_req.write(JSON.stringify());
    post_req.end();
});
///////////////end

///////////////Delete Child Start

app.post('/deletec/:pid/:cid',function(request,response){
var pid = request.params.pid,
cid = request.params.cid;

  var options = {
        host: varHost,
        port: 443,
        path: '/salesApi/resources/latest/TitleMaster_c/'+ pid + '/child/ReleaseVersionCollection_c/' + cid,
        data:request.body,
        method:'DELETE',
        headers: {
        'Authorization': varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
  var post_req = https.request(options, function(res) {
      res.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
      });
            res.on('end', function() {
        debugger;
        response.send({statusCode : 200});
      })
    }).on('error', function(e){
    console.error(e);
  });
    //post_req.write(JSON.stringify());
    post_req.end();
});
///////////////end

function send404(response){
	response.writeHead(404, {'Context-Type' : "text/plain"});
	response.write("Error 404 : Page not Found");
	response.end();
}




http.createServer(app).listen(8888);
console.log('Server is now Running');

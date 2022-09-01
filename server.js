var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require("body-parser");
const router = express.Router();

const apiUrl = "/api/file/"

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/test', function (req, res) {
   res.send('Hello World smeg heads');
})

app.post(apiUrl + 'get', function(req, res){
  const fileName = req.body.fileName
  fs.readFile(fileName, 'utf8', function (err, data) {
    console.log( data );
    res.send( data );
 });

})

app.post(apiUrl + 'save', function(req, res){
  const fileContent = req.body.fileContent
  let fileName = req.body.fileName

  console.log(req)
  console.log(fileContent)
  console.log(fileName)

  fs.writeFile(fileName, fileContent, err => {
    if(err){
      res.send(SON.parse('{ "saved": false, "message" : "could not save file "' + fileName + ', "error" : "' + err + '"}'))
    }    

  })

  res.send(JSON.parse('{"saved":true}'));

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
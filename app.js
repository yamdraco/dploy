"use strict";

var express = require('express')
  , http = require('http')
  , bodyparser = require('body-parser')
  , Netmask = require('netmask').Netmask
  , fs = require('fs')
  , block = new Netmask('192.30.252.0/22')
  , os = require('os')
  , _ = require('underscore')
  , app = express()

var bitbucketIps = ["131.103.20.165", "131.103.20.166"]

app.set('port', process.env.DPLOY_PORT || '3000');

app.get('/', function(req, res) {
  res.status(200).send({
    status: 'OK'
  })
})

var deploy = function(branch, repo) {
  fs.readFile('./config.json', 'utf-8', function(err, res) {
    res = JSON.parse(res)
    _.each(res.accepts, function(accept) {
      if (accept.branch === branch && accept.repo === repo && accept.hostname === os.hostname()) {
        runScript(accept.script)
      }
    })
  })
}

var runScript = function(scriptFile) {
  var exec = require('child_process').exec
  exec(scriptFile, function(err, stdout, stderr) {
    if (err !== null) {
      console.log(stderr)
    } else {
      console.log("OUT", stdout)
    }
  })
}

app.post('/_deployment', bodyparser.json(), bodyparser.urlencoded({extended: false}), function(req) {
  var branch = ""
    , repo = ""
    // bitbucket
    if (bitbucketIps.indexOf(req.ip) !== -1) { 
      try {
        if(_.isString(req.body.payload))
          req.body.payload = JSON.parse(req.body.payload)
      } catch(err) {
        return
      }

      repo = req.body.payload.repository.absolute_url || ""
      if (req.body.payload.commits.length > 0) {
        branch = req.body.payload.commits[0].branch
      }
      deploy(branch, repo)
  
    // github
    } else if (block.contains(req.ip)) {
      repo = req.body.repository.full_name

      var refs = req.body.ref.split('/')
      branch = refs[refs.length -1]
      deploy(branch, repo)
    }
})

module.exports = app
http.createServer(app).listen(app.get('port'), function(){
  console.log("continuous delivery server listening on port " + app.get('port'))
})

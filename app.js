"use strict";

var express = require('express')
  , http = require('http')
  , bodyparser = require('body-parser')
  , config = require(process.env.DPLOY_CONFIG || './config.json')
  , _ = require('underscore')
  , app = express()

app.set('port', process.env.DPLOY_PORT || '60000');

app.get('/', function(req, res) {
  res.status(200).send({
    status: 'OK'
  })
})

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

var path = (process.env.DPLOY_PATH_KEY) ? '/' + process.env.DPLOY_PATH_KEY + '-bitbucket' : '/bitbucket'
app.post(path, bodyparser.json(), bodyparser.urlencoded({ extended: false }), function(req, res) {
  try {
    if (_.isString(req.body.payload))
      req.body.payload = JSON.parse(req.body.payload)
  } catch(err) {
  }

  var bitbucketIps = config.bitbucketIps || []
    , authorizedIps = config.authorizedIps || []
    , repository = req.body.payload && req.body.payload.repository && req.body.payload.repository.absolute_url || ""

  // make sure the ip is authorized
  if (authorizedIps.indexOf(req.ip) >= 0 || bitbucketIps.indexOf(req.ip) >= 0) {
    // filter by accepted commit in the right repo only && belongs to bitbucket
    var accepts = _.filter(config.accepts, function(accept) {
      return accept.repository === repository && accept.source === 'bitbucket'
    })

    // for each commit, make sure it contains the branch we want
    var matches = _.map(accepts, function(accept) {
      if (_.find(req.body.payload.commits, function(commit) {
        return accept.branch === commit.branch
      }))
        return accept
      else 
        return null
    })
    matches = _.compact(matches)

    res.status(200).send({
      status: 'OK'
    , commits: _.map(matches, function(match) {
        return {
          branch: match.branch
        , repo: match.key || match.repository
        }
      })
    })

    _.each(matches, function(match) {
      runScript(match.script)
    })
  } else {
    res.status(403).send({
      status: 'Forbidden'
    })
  }
})

module.exports = app
http.createServer(app).listen(app.get('port'), function(){
  console.log("continuous delivery server listening on port " + app.get('port'))
})

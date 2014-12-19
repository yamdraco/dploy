/**
 *
 * Description: test cases for pretending to send from bitbucket
 *
 * Author: Draco Yam
 *
 */
"use strict";

var assert = require('chai').assert
  , request = require('supertest')
  , app = require('./../app.js')

describe('System status', function() {
  it('should be able to get a response if the system is up', function(done) {
    request(app)
      .get('/')
      .end(function(err, res) {
        assert.equal(err, null)
        assert.equal(res.status, 200)
        var result = JSON.parse(res.text)
        assert.equal(result.status, 'OK')
        done()
      })
  })
})

if(process.env.DEPLOY_CONFIG === './tests/configs/invalidConfig.json') {
  describe('Bitbucket for invalid', function() {
    it('should be able to reject unacceptable ip', function(done) {
      request(app)
        .post('/bitbucket')
        .send({})
        .end(function(err, res) {
          assert.equal(err, null)
          assert.equal(res.status, 403)
          var result = JSON.parse(res.text)
          assert.equal(result.status, 'Forbidden')
          done()
        })
    })
  })
}

if(process.env.DEPLOY_CONFIG === './tests/configs/invalidIpConfig.json') {
  describe('invalid ip', function() {
    it('should be able to reject unacceptable ip', function(done) {
      request(app)
        .post('/bitbucket')
        .send({})
        .end(function(err, res) {
          assert.equal(err, null)
          assert.equal(res.status, 403)
          var result = JSON.parse(res.text)
          assert.equal(result.status, 'Forbidden')
          done()
        })
    })
  })
}

if(process.env.DEPLOY_CONFIG === './tests/configs/normalConfig.json') {
  describe('normal configuration', function() {
    it('should be able to get 2 script run out of 4', function(done) {
      request(app)
        .post('/random-string-bitbucket')
        .send({
          "canon_url": "https://bitbucket.org"
        , "commits": [
            {
              "author": "marcus"
            , "branch": "production"
            , "files": [
                {
                  "file": "somefile.py"
                , "type": "modified"
                }
              ]
            , "message": "Added some more things to somefile.py"
            , "node": "620ade18607a"
            , "parents": [
                "702c70160afc"
              ]
            , "raw_author": "Marcus Bertrand <marcus@somedomain.com>"
            , "raw_node": "620ade18607ac42d872b568bb92acaa9a28620e9"
            , "revision": null
            , "size": -1
            , "timestamp": "2012-05-30 05:58:56"
            , "utctimestamp": "2012-05-30 03:58:56+00:00"
            }
          ]
        , "repository": {
            "absolute_url": "/marcus/project-x/"
          , "fork": false
          , "is_private": true
          , "name": "Project X"
          , "owner": "marcus"
          , "scm": "git"
          , "slug": "project-x"
          , "website": "https://atlassian.com/"
          }
        , "user": "marcus"
        })
        .end(function(err, res) {
          assert.equal(err, null)
          assert.equal(res.status, 200)
          var result = JSON.parse(res.text)
          assert.equal(result.status, 'OK')
          assert.equal(result.commits.length, 2)
          assert.equal(result.commits[0].branch, 'production')
          assert.equal(result.commits[1].branch, 'production')
          assert.equal(result.commits[0].repo, 'repo-1')
          assert.equal(result.commits[1].repo, 'repo-2')
          done()
        })
    })
  })
}




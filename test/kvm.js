// kvm.js
// ------------------------------------------------------------------
//
// Tests for KVM operations.
//
// Copyright 2018 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/* global describe, faker, it, before */

var common = require('./common');

describe('KVM', function() {
  this.timeout(common.testTimeout);
  this.slow(common.slowThreshold);
  common.connectEdge(function(edgeOrg) {
    const num = faker.random.number(),
          word = faker.lorem.word(),
          kvmName = "apigee-edge-js-test-" + word + '-' + num;
    var environments = [];

    before(function(done) {
      edgeOrg.environments.get(function(e, result) {
        assert.isNull(e, "error listing: " + JSON.stringify(e));
        environments = result;
        done();
      });
    });

    describe('create', function() {

      it('should create a kvm in each env', function(done) {
        var numDoneEnv = 0;
        environments.forEach(function(env) {
          edgeOrg.kvms.create({name:kvmName, environment:env}, function(e, result){
            assert.isNull(e, "error creating: " + JSON.stringify(e));
            numDoneEnv++;
            if (numDoneEnv == environments.length) {
              done();
            }
          });
        });
      });

      it('should fail to create an env-scoped KVM with no name', function(done) {
        var numDoneEnv = 0;
        environments.forEach(function(env) {
          edgeOrg.kvms.create({environment:env}, function(e, result){
            //if (e) { console.log(JSON.stringify(e, null, 2) + '\n'); }
            assert.isNotNull(e, "the expected error did not occur");
            numDoneEnv++;
            if (numDoneEnv == environments.length) {
              done();
            }
          });
        });
      });

      it('should create an org-scoped kvm', function(done) {
        edgeOrg.kvms.create({name:kvmName}, function(e, result){
          assert.isNull(e, "error creating: " + JSON.stringify(e));
          done();
        });
      });

      it('should fail to create an org-scoped KVM with no name', function(done) {
        edgeOrg.kvms.create({}, function(e, result){
          assert.isNotNull(e, "the expected error did not occur");
          done();
        });
      });

      it('should fail to create an org-scoped KVM with an empty name', function(done) {
        edgeOrg.kvms.create({name:''}, function(e, result){
          assert.isNotNull(e, "the expected error did not occur");
          done();
        });
      });

      // FIXME: b/120421482
      // it('should fail to create a KVM with an invalid env name', function(done) {
      //   edgeOrg.kvms.create({name:kvmName, env:faker.random.alphaNumeric(22)}, function(e, result){
      //     console.log(JSON.stringify(result, null, 2) + '\n');
      //     if (e) { console.log(JSON.stringify(e, null, 2) + '\n'); }
      //     assert.isNotNull(e, "the expected error did not occur");
      //     done();
      //   });
      // });

    });


    describe('get', function() {

      it('should get KVMs from each env', function(done) {
        var numDoneEnv = 0;
        environments.forEach(function(env) {
          edgeOrg.kvms.get({environment:env}, function(e, result){
            assert.isNull(e, "error getting: " + JSON.stringify(e));
            assert.isAtLeast(result.length, 1, "zero results");
            numDoneEnv++;
            if (numDoneEnv == environments.length) {
              done();
            }
          });
        });
      });

      // FIXME: b/120421482
      // it('should fail to get KVMs from a non-existent env', function(done) {
      //   edgeOrg.kvms.get({environment:faker.random.alphaNumeric(22)}, function(e, result){
      //     console.log(JSON.stringify(result, null, 2) + '\n');
      //     assert.isNotNull(e, "the expected error did not occur");
      //     done();
      //   });
      // });

    });

    describe('delete', function() {

      it('should delete a kvm from each env', function(done) {
        var numDoneEnv = 0;
        environments.forEach(function(env) {
          edgeOrg.kvms.del({name:kvmName, environment:env}, function(e, result){
            assert.isNull(e, "error deleting: " + JSON.stringify(e));
            numDoneEnv++;
            if (numDoneEnv == environments.length) {
              done();
            }
          });
        });
      });

      it('should fail to delete an invalid kvm from each env', function(done) {
        var numDoneEnv = 0;
        environments.forEach(function(env) {
          edgeOrg.kvms.del({name: faker.random.alphaNumeric(22), environment:env}, function(e, result){
            assert.isNotNull(e, "the expected error did not occur");
            numDoneEnv++;
            if (numDoneEnv == environments.length) {
              done();
            }
          });
        });
      });

      it('should delete an org-scoped kvm', function(done) {
        edgeOrg.kvms.del({name:kvmName}, function(e, result){
          assert.isNull(e, "error deleting: " + JSON.stringify(e));
          done();
        });
      });

      it('should fail to delete a KVM from org-scope because no name was specified', function(done) {
        edgeOrg.kvms.del({}, function(e, result){
          assert.isNotNull(e, "the expected error did not occur");
          done();
        });
      });

      it('should fail to delete a non-existent KVM from org-scope', function(done) {
        edgeOrg.kvms.del({name: faker.random.alphaNumeric(22)}, function(e, result){
          assert.isNotNull(e, "the expected error did not occur");
          done();
        });
      });

    });

  });


});

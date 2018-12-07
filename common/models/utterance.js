'use strict';


// The tutorial recommends using dotenv for the following variable declarations.
const AWS = require("aws-sdk");
const awsRegion = "us-east-1";

AWS.config.update({
  accessKeyId: "AKIAI77BV3U7O4ZI5YHA",
  secretAccessKey: "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",
  region: awsRegion,
});

const lexruntime = new AWS.LexRuntime();
const crypto = require("crypto");

const params = {
  botAlias: "ResumeBot" /* required */,
  botName: "ResumeBot" /* required */
};


module.exports = utterance => {
  
  var sessionid = crypto.randomBytes(20).toString("hex");

    utterance.openingStatement = cb => {
      // create a unique sessionid to keep track of the session
   
      let response = { 
        message: "Hi there. You are interacting with Hunter Templeman's ResumeBot!",
        sessionid: sessionid
      }

      utterance.create(response)
      
      cb(null, sessionid, response)

    };

    utterance.remoteMethod("openingStatement", {
      returns: [
        {
          arg: "SessionKey",
          type: "string"
        },
        {
          arg: "Response",
          type: "string"
        }
      ]
    })

    utterance.message = function (sessionkey, message, cb) {
      let req_params = Object.assign(params, {
        userId: sessionkey,
        inputText: message
      });

      let response = { 
        message: message,
        sessionid: sessionkey
      }
      utterance.create(response)

      lexruntime.postText(req_params, (err, data) => {
        if (err) console.log(err, err.stack);
        else 
          var lexresponse = { 
            message: data.message,
            sessionid: sessionid 
          }
          utterance.create(lexresponse)
          cb(null, sessionkey, data);
      });
    };

    utterance.remoteMethod("message", {
      accepts: [
        {
          arg: "SessionKey",
          type: "string"
        },
        {
          arg: "Message",
          type: "string"
        }
      ],
      returns: [
        {
          arg: "SessionKey",
          type: "string"
        },
        {
          arg: "Response",
          type: "string"
        }
      ]
    });

};

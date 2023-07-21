const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");
const serverless = require("serverless-http");




const app = express();
const router = express.Router();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/.netlify/functions/server", router);





router.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");

});

router.post("/", function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/7d91b99057";
    const options = {
        method: "POST",
        auth: "ronnyett:fed2d5f68358b502926261d192aecb78-us21"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();



});

router.post("/failure", function (req, res) {
    res.redirect("/");
});



module.exports = app;
module.exports.handler = serverless(app);





// app.listen(3000, function () {
//     console.log("Server is running on port 3000");
// });


//API Key
//fed2d5f68358b502926261d192aecb78-us21

//list id
// 7d91b99057




// --data @- \
// <<EOF | jq '.id'
// {
//   "email_address": "$user_email",
//   "status": "pending",
//   "merge_fields": {
// 	"FNAME": "$user_fname",
// 	"LNAME": "$user_lname",
// 	"BIRTHDAY": "$user_birthday",
// 	"ADDRESS": {
//            "addr1": "123 Freddie Ave",
//            "city": "Atlanta",
//            "state": "GA",
//            "zip": "12345",

//      }
//}


require('dotenv').config();
const config = require('./config.js');
const express = require('express');
const crypto = require("crypto");
const fs = require('fs');
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

const pemFileName = config.publicKeyPemFile;
const publicKeyStr = fs.readFileSync(pemFileName);
console.log("publicKeyStr : %s", publicKeyStr);

const publicKey = crypto.createPublicKey(
    {
        key: publicKeyStr,
        format: 'pem',
        type: 'spki'
    });

app.put('/shipments', (req, res) => {
   console.log(req.body);
   const authorizationHdr = req.header('authorization');
   const hostHdr = req.header("host");
   const dateHdr = req.header("date");
   const digestHdr = req.header("digest");
   const inputStr = hostHdr + dateHdr + digestHdr;

   console.log("inputStr : %s  | authorization : %s", inputStr, authorizationHdr);

   const pattern = /signature="(.*)"/;
   const matchedAry = authorizationHdr.match(pattern);
   const signature = matchedAry[1];
   console.log("signature : %s", signature);

   const isLegit = isLegitDigitalSignature(signature, inputStr);
   console.log("verifySignature isVerified : %s", isLegit);

    return res.status(204).end();
});

function isLegitDigitalSignature(signature, inputData) {
    return crypto.verify(
        'rsa-sha256',
        inputData,
        publicKey,
        Buffer.from(signature, 'base64')
    );
}

const server = app.listen(8889, function () {
    let address = server.address();
    console.log("listening at %", address);
});



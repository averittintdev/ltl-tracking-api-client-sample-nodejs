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

const publicKeyStr = fs.readFileSync('/home/jason/software/temp/public_key_rsa_4096_pkcs8-exported.pem');
console.log("publicKeyStr : %s", publicKeyStr);

const publicKey = crypto.createPublicKey(
    {
        key: publicKeyStr,
        format: 'pem',
        type: 'spki'
    });

app.post('/shipments', (req, res) => {
   console.log(req.body);
   const authorizationHdr = req.header('authorization');
   const hostHdr = req.header("host");
   const dateHdr = req.header("date");
   const digestHdr = req.header("digest");
   const inputStr = hostHdr + dateHdr + digestHdr;
   const inputBytes = Array.from(Buffer.from(inputStr, "utf8"));
   console.log("inputBytes : %s  |  inputStr : %s  | authorization : %s", inputBytes, inputStr, authorizationHdr);

   const pattern = /signature="(.*)"/;
   const matchedAry = authorizationHdr.match(pattern);
   const signature = matchedAry[1];
   console.log("signature : %s", signature);

   verifySignature(signature, inputStr);
   verify(signature, inputStr);
});

function verify(signature, inputData) {
    const verify = crypto.createVerify("rsa-sha256");
    verify.update(inputData);
    const isVerified = verify.verify(publicKey, signature, 'base64');
    console.log("verify - isVerified : %s", isVerified);
}

function verifySignature(signature, inputData) {
    const isVerified = crypto.verify(
        'rsa-sha256',
        inputData,
        publicKey,
        Buffer.from(signature, 'base64')
    );
    console.log("verifySignature isVerified : %s", isVerified);
}

const server = app.listen(8888, function () {
    let address = server.address();
    console.log("listening at %", address);
});



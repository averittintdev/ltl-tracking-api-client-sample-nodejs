# NodeJS Code Sample for HTTP Signature Verification

---

Initially constructed with node version 16.15.1

This code shows how to validate the HTTP signature included in the HTTP header sent to the client's webhook.

To run the sample code, download the pem file.  
Create a configuration file, `.env`, in the root of this project and set it with the following.
AVERITT_TRACKING_API_PUBLIC_KEY_FILE=/some/path/to/the/pem/file

`npm install dotenv`

`npm start`
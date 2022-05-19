# My site

ref this [site](https://developer.mozilla.org/zh-TW/docs/Learn/Server-side/Express_Nodejs/mongoose)

## notes

### Run

1. install nodemon
2. add devstart script in package.json

    ```json
    "scripts": {
        "devstart": "nodemon ./bin/www"
    },
    ```

3. run

    ```cmd
    DEBUG=sever:* npm run devstart
    ```

4. click [this](https://localhost:8443)

### Change from http to https

1. https: ref this [site](http://blog.fens.me/nodejs-https-server/)

    ```cmd
    mkdir sslcert
    cd sslcert
    genrsa -out privatekey.pem 1024
    openssl req -new -key privatekey.pem -out certrequest.csr
    openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
    ```

2. change www code in ./bin/www

    ```js
    var http = require('http'); //change from
    var https = require('https'); //change to

    var fs = require('fs'); //add
    var privateKey  = fs.readFileSync('sslcert/privatekey.pem'); //add
    var certificate = fs.readFileSync('sslcert/certificate.pem'); //add
    var credentials = {key: privateKey, cert: certificate}; //add

    var server = http.createServer(app); //change from
    var server = https.createServer(credentials, app); //change to

    var port = normalizePort(process.env.PORT || '3000'); //change from
    let myport = 8443; //change to
    /*
    if change to 443 or 80, need to use sudo to run in mac.
    */
    var port = normalizePort(process.env.PORT || myport);  //change to
    ```

### Install and run MongoDB

[ref MongoDB site](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

1. install

    ```cmd
    brew tap mongodb/brew
    brew install mongodb-community
    ```

2. run

    ```cmd
    brew services start mongodb-community
    ```

3. stop

    ```cmd
    brew services stop mongodb-community
    ```

4. config file(used for remote access for my work computer)

    ```cmd
    nano /opt/homebrew/etc/mongod.conf
    # add IP in bindIP
    brew services restart mongodb-community
    ```

### Login logic

1. check cookie, if yes, use cookie pass/acc
2. if no, redirect to login page
3. if press logout, go to logout and clear cookie
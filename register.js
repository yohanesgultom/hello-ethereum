const http = require('http');
const qs = require('querystring');
const port = 3000;
const web3_extended = require('web3_ipc');
const fs = require('fs');
web3 = web3_extended.create({
    host: process.env.ipc || 'hello1/geth.ipc',
    ipc:true,
    personal: true,
    admin: true,
    debug: false
});

// simple in-memory data for POC
const data = [];

// ethereum blockchain datadir
var datadir;

const app = http.createServer(function(req, res){
    if (req.url == '/') {
        if (req.method == 'GET') {
            web3.eth.getAccounts(function(error, response){
                if(!error) {
                    console.log(response);
                    res.writeHead(200, {'Content-type':'text/html'});
                    res.write('<h1>Account List</h1>');

                    res.write('<form action="" method="POST">')
                    res.write('<label>Email</label> <input type="email" name="email" required autofocus/> ');
                    res.write('<label>Public wallet</label> <input type="text" name="public_wallet" required/> ');
                    res.write('<input type="submit" value="Create new account"/>');
                    res.write('</post>');

                    if (data.length == 0 || response.length == 0) {
                        res.write('<p>No account</p>');
                    } else {
                        console.log(data);
                        res.write('<br><br>');
                        res.write('<table border="1" cellspacing="0" cellpadding="1">');
                        res.write('<tr><th>Email</th><th>Public Wallet</th><th>Private Wallet</th><th>Private Keystore</th></tr>');
                        response.forEach(function (account) {
                            let accountData = data.find(function (it) { return it.private_wallet == account });
                            if (accountData) {
                                res.write('<tr><td>' + accountData.email + '</td><td>' + accountData.public_wallet + '</td><td>' + accountData.private_wallet + '</td><td>' + accountData.private_keystore + '</td></tr>');
                            }
                        });
                        res.write('</table>');
                    }
                    res.end();
                 } else {
                    console.error(error);
                    res.writeHead(500);
                    res.write(error.message);
                    res.end();
                 }
            })

        } else if (req.method == 'POST') {
            let body = [];
            req.on('error', (err) => {
                console.error(err);
                res.writeHead(500);
                res.write(error.message);
                res.end();
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = qs.parse(Buffer.concat(body).toString());
                // use time as hash seed
                let uniqueStr = Date.now().toString();
                web3.personal.newAccount(uniqueStr, function (error, result){
                    if(!error){
                        console.log('new wallet: ' + result.toString());
                        body.private_wallet = result;
                        // find keystore in keystore directory
                        body.private_keystore = fs.readdirSync(datadir + '/keystore').find(function (f) { return f.endsWith(body.private_wallet.substring(2)); })
                        data.push(body);
                        res.writeHead(301, { Location: 'http://localhost:' + port });
                        res.end();
                    } else {
                        console.error(error);
                        res.writeHead(500);
                        res.write(error.message);
                        res.end();
                    }
                });
            });
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

app.listen(port, function () {
    web3.admin.datadir(function(error, result) {
        if (!error) {
            datadir = result;
            console.log('Blockchain datadir: ' + result);
            console.log('Server running on http://localhost:' + port);
        } else {
            console.error(error);
            process.exit();
        }
    });
});

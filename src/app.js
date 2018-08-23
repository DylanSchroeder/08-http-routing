'use strict';

const http = require('http');

const requestParser = require('./lib/request-parser');

const app = http.createServer(requestHandler);
const cowsay = require('cowsay');
module.exports = app;

app.start = (port) =>
  new Promise((resolveCallback, rejectCallback) => {
    app.listen(port, (err, result) => {
      if (err) {
        rejectCallback(err);
      } else {
        resolveCallback(result);
      }
    });
  });

function requestHandler(req, res) {
  console.log(`${req.method} ${req.url}`);

  requestParser(req)
    .then(() => {
      if (req.parsedUrl.pathname === '/500') {
        throw new Error('Test Error');
      }

      if (req.method === 'GET' && req.parsedUrl.pathname === '/') {
        html(res, `<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>  
          </head>
          <body>
           <header>
             <nav>
               <ul>
                 <li><a href="/cowsay">cowsay</a></li>
               </ul>
             </nav>
           <header>
           <main>
             <p>This is Dylan's vanilla http server project all about creating HTTP servers and handling HTTP requests!
           </main>
          </body>
        </html>`);
        return;
      }
      if(req.method === 'GET' && req.parsedUrl.pathname === '/cowsay') {
        let message = req.query.text?cowsay.say({text: req.query.text}):cowsay.say({text: 'I need something good to say!'});
        html(res, `<!DOCTYPE html>
        <html>
          <head>
            <title> cowsay </title>  
          </head>
          <body>
            <h1> cowsay </h1>
            <pre>${message}</pre>
          </body>
        </html>`);
        return;
      }
      if(req.method === 'GET' && req.parsedUrl.pathname === '/api/cowsay' && req.query.text) {
        jsonify(res, {
          content: cowsay.say(req.query),
        });
        return;
      }
      if(req.method === 'POST' && req.parsedUrl.pathname === '/api/cowsay' && req.query.text) {
        jsonify(res, {
          content: cowsay.say(req.query),
        });
        return;
      }

      notFound(res);
    })
    .catch(err => {
      console.error(err);
      html(res, err.message, 500, 'Internal Server Error');
    });
}

function html(res, content, statusCode = 200, statusMessage = 'OK') {
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

function jsonify(res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(object));
    res.end();
  } 
  else {
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}

function notFound(res) {
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}


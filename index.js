const fs = require('fs');
const http = require('http');
const url = require('url');

const indexFile = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8');
const cardFile = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const cardDetails = fs.readFileSync(
  `${__dirname}/templates/card-details.html`,
  'utf-8'
);
const data = fs.readFileSync('./dev-data/cards.json', 'utf-8');
const parsedData = JSON.parse(data);

const replaceTemp = (temp, data) => {
  let output = temp.replace(/{%IMAGE%}/g, data.image);
  output = output.replace(/{%PARAGRAPH%}/g, data.content);
  output = output.replace(/{%ID%}/g, data.id);
  output = output.replace(/{%DESCRIPTION%}/g, data.description);

  return output;
};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);

  if (pathname == '/') {
    const cardsHtml = parsedData
      .map((item) => replaceTemp(cardFile, item))
      .join('');
    const output = indexFile.replace(/{%CARDS%}/g, cardsHtml);
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end(output);
  } else if (pathname == '/project' || pathname == '/project/') {
    const id = query.split('=')[1];
    const cardHtml = replaceTemp(cardDetails, parsedData[id - 1]);
    res.end(cardHtml);
  } else if (pathname == '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, '192.168.0.108', () => {
  console.log('Server running on port 8000');
});

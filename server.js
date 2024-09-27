const http = require('http');
const fs = require('fs');
const url = require('url');
const utils = require('./modules/utils');
const en = require('./lang/en/en');


class FileHandler {
    writeFile(text, filepath, callback) {
        fs.appendFile(filepath, `${text}\n`, callback);
    }

    readFile(filepath, callback) {
        fs.readFile(filepath, 'utf8', callback);
    }
}


class Server {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.fileHandler = new FileHandler('./data.txt');
    }

    start() {
        http.createServer((req, res) => {
            const q = url.parse(req.url, true);
            const path = q.pathname;
            console.log(`Path: ${path}`);

            const query = q.query;

            if (path === "/labs/lab3/getDate/") {
                this.handleGetDate(query.name, res);

            } else if (path === "/labs/lab3/writeFile/") {
                this.handleWriteFile(query.text, './labs/lab3/data.txt', res);

            } else if (path.startsWith("/labs/lab3/readFile/")) {
                const filename = path.split('/').pop();
                this.handleReadFile(filename, res);
            }
        }).listen(this.port, this.host);
    }

    handleGetDate(name, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const user = name || "Anonymous";
        const date = utils.getDate();
        res.end(`<p style="color:blue">${en.messages.dateMessage.replace('%1', user)} ${date}</p>`);
    }

    handleWriteFile(text, filepath, res) {
        const fileText = text || '';
        res.writeHead(200, {'Content-Type': 'text/html'});
        this.fileHandler.writeFile(fileText, filepath, () => {
            res.end(`<p>${en.messages.writeSuccess}</p>`);
        });
    }

    handleReadFile(filename, res) {
        this.fileHandler.readFile(`./labs/lab3/${filename}`, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end(`<p>${en.messages.readFail.replace('%1', filename)}</p>`);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(`<p style="white-space:pre-line">${data}</p>`);
            }
        });
    }
}


const server = new Server('localhost', 8888);
server.start();
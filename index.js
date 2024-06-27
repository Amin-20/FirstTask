const fs = require("fs");
const url = require("url");
const http = require("http");
const path = require("path");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-studentCard.html`,
  "utf-8"
);
const tempStudent = fs.readFileSync(
  `${__dirname}/templates/template-student.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/devdata/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname.startsWith("/public")) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { "Content-Type": getContentType(filePath) });
        res.end(data);
      }
    });
  }
  else if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    cardsHtml=dataObj.map(i=>replaceTemplate(tempCard,i)).join('')
    output=tempOverview.replace('{%STUDENT_CARDS%}',cardsHtml);
    res.end(output);
  }

  else if(pathname==='/student'){
    res.writeHead(200,"Content-type:text/html");
    let index = dataObj.findIndex(student => student.id === parseInt(query.id));
    const student=dataObj[index];
    const output=replaceTemplate(tempStudent,student);
    res.end(output);
  }
});

server.listen(27005, "127.0.0.1", () => {
  console.log("Listening to requests on port 27005");
});

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case ".html":
      return "text/html";
    case ".css":
      return "text/css";

    default:
      return "text/plain";
  }
}



const replaceTemplate=(temp,item)=>{
    let output=temp.replace(/{%NAME%}/g,item.name);
    output=output.replace(/{%SURNAME%}/g,item.surname);
    output=output.replace(/{%BIRTHDATE%}/g,item.birthDate);
    output=output.replace(/{%SERIANO%}/g,item.seriaNo);
    output=output.replace(/{%SCORE%}/g,item.score);
    output=output.replace(/{%IMAGE%}/g,item.imageUrl);
    output=output.replace(/{%ID%}/g,item.id);
    return output;

}
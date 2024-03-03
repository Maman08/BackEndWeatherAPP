const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homefile = fs.readFileSync("Home.html", "utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature=temperature.replace("{%mintempval%}",orgVal.main.temp_min);
     temperature=temperature.replace("{%maxtempval}",orgVal.main.temp_max);
  temperature=temperature.replace("{%location%}",orgVal.name);
  temperature=temperature.replace("{%country%}",orgVal.sys.country);
  temperature=temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid=edda7f49d17e416522f7ef10a3a2a63f")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData.map((val) => {
                return replaceVal(homefile, val);
            });
            res.write(realTimeData.join(""));
        })
        
            .on("end", (err) => {
                if (err) {
                    console.log("Connection closed due to errors", err);
                    res.end("Error");
                } 
            });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404 Not Found");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Server is running on http://127.0.0.1:8000/");
});



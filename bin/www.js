"use strict"
const http  = require("http");
const path  =  require("path");
const fs    = require("fs"); 
const recursiveReadSync = require('recursive-readdir-sync');
const dir = path.join(__dirname,"../public");

const normalize  =  async (file)=>{
	return path.normalize(file);
}

const readFile  =  async ()=> {
	let listDir  =  await recursiveReadSync(dir);
	let dirArr = [];/// it sama function if use  "new Array()" 
	for(var key in  listDir) {
		// rule 1 if not html stop
		if (listDir[key].includes(".html")) {
			// rule 2 if file  is index make file to 2 array index and /
			if (listDir[key].includes("index")) {
				dirArr.push({
					name:listDir[key].replace(await normalize(dir+"/index.html"),"/") , 
					file:listDir[key]
				})
			}  
			dirArr.push({ 
				name:listDir[key].replace(await normalize(dir+"/"),"/").replace(".html","") , 
				file:listDir[key]
			})
		}
	}
	return await dirArr;
}
const server  =  http.createServer(async(req,res)=>{
	let route  = await readFile();
	for(var key in route) {
		if (route[key].name == req.url) {
			let file =  await fs.readFileSync(route[key].file).toString("utf8");
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(file);
			return res.end();
		}
	}
	res.writeHead(404, {'Content-Type': 'text/html'});
	res.write("<h1>OOPS TERJADI SESUATU</h1>")
	return res.end();
})
// if nedd push to server change port to 80 but if for development recomended use 8080
server.listen(8080,"0.0.0.0")
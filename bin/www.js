"use strict"
const http  = require("http");
const path  =  require("path");
const fs    = require("fs"); 
const recursiveReadSync = require('recursive-readdir-sync');
const dir = path.join(__dirname,"../public");

const readFile  =  async ()=> {
	let listDir  =  await recursiveReadSync(dir);
	let dirArr = [];/// it sama function if use  "new Array()" 
	await listDir.forEach((item)=>{
		let indir  =  item.replace(dir,"");
		// rule 1 if not html stop
		if (item.includes(".html")) {
			// rule 2 if file  is index make file to 2 array index and /
			if (item.includes("index")) {
				dirArr.push({
					name:item.replace(dir+"/index.html","/") , 
					file:item
				})
				dirArr.push({ 
					name:item.replace(dir,"").replace(".html","") , 
					file:item
				})
			} else {
				dirArr.push({ 
					name:item.replace(dir,"").replace(".html","") ,
					file:item 
				})
			}
		}
	})
	// example response
	//console.log(dirArr)
	return dirArr;
}
const server  =  http.createServer(async(req,res)=>{
	let route  = await readFile();
	route.forEach((item)=>{
		if (item.name == req.url) {
			let file =  fs.readFileSync(item.file).toString("utf8");
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(file);
			return res.end();
		}
	})
	res.writeHead(404, {'Content-Type': 'text/html'});
	res.write("<h1>OOPS TERJADI SESUATU</h1>")
	return res.end();
})

server.listen(9090,"0.0.0.0")
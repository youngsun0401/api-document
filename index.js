const http = require('http');
const fs = require('fs').promises;
const parse_url = require('./mod/parse_url.js');

const server = http.createServer(async (req, res)=>{
    let log = '';
    log += (`[${req.method}] ${req.url}`)

    try{
        const myRes = parse_url( req.url );

        console.log(log)

        const f = 
            ( await fs.readFile( './src' + myRes.path , 'utf8') )
            .replace('{{room}}', myRes.room)
        ;

        const ext = myRes.ext;
        res.writeHead(
            200,
            {'Content-Type': myRes.contentType }
        );
        res.end( f );

    }catch(err){
        console.error('에러가 발생했습니다. ...' + log);
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>이게뭐야!!!</h1>');
        res.end( err.message );
    }
}).listen(9977);

server.on('listening', ()=>{
    console.log('9977 포트에서 서버 연결 중')
});
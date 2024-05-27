const http = require('http');
const fs = require('fs').promises;

const get_ext = ( text )=>{
    const s1 = text.split('/');
    const s = s1[ s1.length - 1 ].split('.')
    if( s.length <= 1 ) return null;

    return s[ s.length - 1 ];
}

const url_to_myRes = ( url )=>{
    let path ;
    let ext ;
    let room ;

    if( url === '/' ){
        path = '/index.html'
        ext = 'html'
        room = '/view'
    }

    else{
        const rawExt = get_ext( url );

        if( rawExt == null ){
            path = '/index.html'
            ext = 'html'
            room = url
        }else{
            path = url
            ext = rawExt
        }
    }


    return {
        path : path,
        ext  : ext,
        room : room,
    };
}

const ext_to_contentType = ( ext )=>{
    if( ext === 'html')    return 'text/html; charset=utf-8';
    if( ext === 'css')     return 'text/css';
    if( ext === 'js')      return 'application/javascript';
    if( ext === 'json')    return 'application/json';
    if( ext === 'png')     return 'image/png';
    if( ext === 'jpg'
     || ext === 'jpeg')    return 'image/jpeg';

    return 'text/plain';
}

const server = http.createServer(async (req, res)=>{
    let log = '';
    log += (`[${req.method}] ${req.url}`)

    try{
        const myRes = url_to_myRes( req.url );

        console.log(log)

        const f = 
            ( await fs.readFile( './src' + myRes.path , 'utf8') )
            .replace('{{room}}', myRes.room)
        ;

        const ext = myRes.ext;
        res.writeHead(
            200,
            {'Content-Type': ext_to_contentType( myRes.ext )}
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
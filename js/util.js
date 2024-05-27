const load_text = async ( src )=>{
    const response = await fetch( src );
    if( !response.ok ) throw new Error('Network response was not ok 222 ' + response.statusText);

    return response.text();
}


const load_json = async ( src )=>{
    const response = await fetch( src );
    if( !response.ok ) throw new Error('Network response was not ok 222 ' + response.statusText);

    return response.json();
}

const load_js = async ( src )=>{ return new Promise((resolve,reject)=>{
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src + '.js';
    script.onload = ()=>{ resolve( src ) };
    script.onerror = ()=>{ reject( new Error('no script file: ' + src) ) };

    document.head.appendChild(script);
})}

const load_css = async ( src )=>{ return new Promise((resolve,reject)=>{
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = src + '.css';
    link.onload = ()=>{ resolve(src) };
    link.onerror = ()=>{ reject( new Error('no stylesheet file: ' + src) ) };

    document.head.appendChild(link);
})}

const text_to_fileDownload = ( text , fileName )=>{
    if( !typeCheck( text, 'string') ) return null;

    if( fileName == null ) fileName = 'file';

    const blob = new Blob([text], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
}

const notEmptyStr = ( text )=>{
    if( text == null ) return false;
    if( text == '' ) return false;
    return true;
}

const typeCheck = ( data , type , letsConsoleErr )=>{
    if( type == 'Array' ){
        if( Array.isArray( data ) ) return true;
    }else{
        if( typeof data === type ) return true;
    }

    if( letsConsoleErr == null || letsConsoleErr ) console.error(`data format error: this is not a ${type} ...`, data)

    return false;
}

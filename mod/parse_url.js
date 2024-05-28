const parse_url = ( urlRaw )=>{

    const result = extract_params( urlRaw );

    if( result.url === '/' ){
        result.path = '/index.html'
        result.ext = 'html'
        result.room = '/view'
    }

    else{
        const rawExt = get_ext( result.url );

        if( rawExt == null ){
            result.path = '/index.html'
            result.ext = 'html'
            result.room = urlRaw
        }else{
            result.path = urlRaw
            result.ext = rawExt
        }
    }

    result.contentType = ext_to_contentType( result.ext );

    return result ;

    function extract_params( urlRaw ){
        const tempParts = urlRaw.split('?');
        const url = tempParts[0];

        const params = [];
        const paramsRaw = tempParts.slice(1).join('?');
        const paramRaws = paramsRaw.split('&');
        for( let paramRaw of paramRaws ){
            const parts = paramRaw.split('=')
            const param = {};
            param[ parts[0] ] = parts.slice(1).join('=');
            params.push(param);
        }

        return {
            url: url,
            params: params
        };
    }

    function get_ext( text ){
        const s1 = text.split('/');
        const s = s1[ s1.length - 1 ].split('.')
        if( s.length <= 1 ) return null;

        return s[ s.length - 1 ];
    }

    function ext_to_contentType( ext ){
        if( ext === 'html')    return 'text/html; charset=utf-8';
        if( ext === 'css')     return 'text/css';
        if( ext === 'js')      return 'application/javascript';
        if( ext === 'json')    return 'application/json';
        if( ext === 'png')     return 'image/png';
        if( ext === 'jpg'
         || ext === 'jpeg')    return 'image/jpeg';

        return 'text/plain';
    }
}

module.exports = parse_url ;


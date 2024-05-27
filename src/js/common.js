const listlist_to_trs = ( listlist ) => {
    if( !typeCheck( listlist, 'Array' ) ) return '';

    let result = '';
    for( const list of listlist ){
        if( !typeCheck( list, 'Array' ) ) return '';
        result += '<tr>'
        for( const item of list ){
            result += `<td>${item}</td>`
        }
        result += '</tr>'
    }
    return result ;
}

const map_to_trs = ( obj ) => {
    if( !typeCheck( obj, 'object' ) ) return '';

    let result = '';
    for( const key in obj ){
        result += `<tr><th>${key}</th><td>${obj[key]}</td></tr>`;
    }
    return result ;
}

const rawText_to_html = ( text )=>{
    if( !typeCheck( text, 'string' ) ) return ;

    tempE = document.createElement('div');
    tempE.innerText = text;
    let result = tempE.innerHTML;

    return result
        .replace(/ {2,}/g, ( match )=>{// 띔
            return '&nbsp;'.repeat( match.length -1 ) + ' ';
        });
}

const combineStrFor = ( funfun , list )=>{
    if( !typeCheck( list, 'Array' ) ) return ;

    let result = '';
    for( const el of list ){
        result += funfun( el );
    }
    return result;
}
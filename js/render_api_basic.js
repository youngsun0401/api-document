const render_api_basic = ( data , hn )=>{
    const TABLE_DEPTH_MAX = 20;

    return `
        <h5>${hn.getSpan5()} ${data.title}</h5>
        <table class="summary">
            <caption>summary</caption>
            <tbody>
                <tr><th>기능</th><td>${data.summary.feature}</td></tr>
                <tr><th>URI</th><td class="code">${data.summary.URI}</td></tr>
                <tr><th>method</th><td class="code">${data.summary.method}</td></tr>
            </tbody>
        </table>
        <div class="request">
            <h6>REQUEST</h6>
            <table class="request-head">
                <caption>head</caption>
                <tbody>${map_to_trs(data.request.head)}</tbody>
            </table>
            ${combineStrFor( fieldsObj_to_table , data.request.body )}
        </div>
        <div class="response">
            <h6>RESPONSE</h6>
            <table class="request-head">
                <caption>head</caption>
                <tbody>${map_to_trs(data.response.head)}</tbody>
            </table>
            ${combineStrFor( fieldsObj_to_table , data.response.body )}
        </div>
        <div class="example">
            <h6>EXAMPLE</h6>
            ${notEmptyStr(data.request.example)
                ? `<table class="requestExample">
                        <caption>request example</caption>
                        <tbody><tr><td class="code">${rawText_to_html(data.request.example)}</td></tr></tbody>
                    </table>`
                : '<p>no request example</p>'
            }
            ${notEmptyStr(data.response.example)
                ? `<table class="responseExample">
                        <caption>response example</caption>
                        <tbody><tr><td class="code">${rawText_to_html(data.response.example)}</td></tr></tbody>
                    </table>`
                : '<p>no response example</p>'
            }
        </div>`;

    function fieldsObj_to_table( obj ){
        if( !typeCheck( obj, 'object' ) ) return '';

        return `<table class="objTable">
            <caption>${obj.name}</caption>
            <thead>
                <tr><th colspan="${TABLE_DEPTH_MAX}">key</th><th>type</th><th>description</th><th>required</th></tr>
            </thead>
            <tbody>
                ${fieldList_to_trs( obj.fields )}
            </tbody>
        </table>`
    }

    function fieldList_to_trs( fields , depth ){
        if( !typeCheck( fields, 'Array' ) ) return '';

        if( depth == null ) depth = 0;

        let result = '';
        for( const field of fields ){
            result += field_to_tr( field , depth );
        }
        return result ;
    }

    function field_to_tr( field , depth ){
        if( !typeCheck( field, 'object' ) ) return '';

        let result = `
            <tr>
                ${blankTds(depth)}
                <td colspan="${TABLE_DEPTH_MAX-depth}"><span class="code">${field.key}<span></td>
                <td>${rawText_to_html(field.type)}</td>
                <td>${rawText_to_html(field.description)}</td>
                <td>${field.required ? 'O' : 'X' }</td>
            </tr>`;

        if( field.innerFields != null ){
            let innerFields = fieldList_to_trs( field.innerFields , depth+1 );

            result += innerFields;
        }

        return result ;

        function blankTds(n){
            let result = '';
            for( let i=0; i<n; i++ ){
                result += `<td class="blankTd blankTd${i%4}"></td>`;
            }
            return result ;
        }
    }
}


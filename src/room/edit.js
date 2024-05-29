let blockList ;
const get_docEl_blockList = ()=> document.getElementById('blockList');

const CONTENT_FORMAT = await fetch('/contents-format-definition.json').then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
});

export const render_room = ()=>{
    fetch('content-data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if( !typeCheck( data, 'Array' ) ) return ;
        blockList = data ;
        render_blockList();
    })
    .catch(err => {
        console.error('failed to get json data ... ', err);
        // alert('failed to get data');
    });
}

function render_blockList(){
    let renderedContent = '';

    let i=0;
    for( let block of blockList ){
        i++;
        let title = block.data.title;
        let editorEL ;
        try{
            editorEL = get_editorEL( block );
            console.log(editorEL);// TODO
        }catch( err ){
            console.error( i+'번 블록 불러오기 실패: '+ err.msg, err.errorTrail );
            continue;
        }
        
        renderedContent += `
            <li class="block blockType-${block.type}"
                    onclick="roomModule.activate_block(this)"
                    data-blocktype="${block.type}">
                <p class="blockHead">
                    <span class="type">${block.type}</span>
                    <span class="title">${title == null ? '' : title}</span>
                </p>
                <div class="editor">${editorEL}</div>
            </li>`;
    }
    get_docEl_blockList().innerHTML = renderedContent;

    function get_editorEL( block ){
        return recursive( block.data, block.type, block.type, [] );

        function recursive( value , type , name , errorTrail ){
            errorTrail.push( name );
            if( type == null )
                throw {
                msg: '이 타입은 정의되어있지 않습니다',
                errorTrail: errorTrail,
            };

            //// TODO ?로 시작하는

            //// leaf
            if( typeCheck( type, 'string', false ) ){
                //// primative types
                if( type === 'STRING')      { errorTrail.pop(); return `<input class="${name}" value="${value}" />`;}
                if( type === 'STRING-CODE') { errorTrail.pop(); return `<input class="${name} code" value="${value}" />`;}
                if( type === 'TEXT')        { errorTrail.pop(); return `<textarea class="${name}">${value}</textarea>`;}
                if( type === 'TEXT-CODE')   { errorTrail.pop(); return `<textarea class="${name} code">${value}</textarea>`;}
                if( type === 'BOOLEAN')     { errorTrail.pop(); return `<input class="${name}" value="${value}" />`;}// TODO
                //// defined types
                let result = recursive( value, CONTENT_FORMAT[ type ], name, errorTrail );
                errorTrail.pop();
                return result;
            }
            //// list
            else if( typeCheck( type, 'Array', false ) ){
                if( !typeCheck( value, 'Array', false ) ){
                    throw {
                        msg: '형식에 맞지 않는 값',
                        type: type,
                        value: value,
                        errorTrail: errorTrail,
                    };
                }
                //// TODO 같은거 반복
                let itemsEl = '';
                for( let i=0; i<value.length; i++ ){
                    itemsEl += `<li>${recursive( value[i], type[0], i, errorTrail )}</li>`;
                }
                let result = `<ul class="${name}">${itemsEl}</ul>`;
                errorTrail.pop();
                return result ;
            }
            //// map
            else if( typeCheck( type, 'object', false ) ){
                if( !typeCheck( value, 'object', false ) ){
                    throw {
                        msg: '형식에 맞지 않는 값',
                        type: type,
                        value: value,
                        errorTrail: errorTrail,
                    };
                }
                //// TODO 빈 옵젝인 경우 자유
                let fieldsEl = '';
                for( let key in type ){
                    fieldsEl += `
                        <tr>
                            <th>${key}</th>
                            <td>${recursive( value[key], type[key], key, errorTrail )}</td>
                        </tr>`;
                }
                let result = `
                    <table class="${name} minThTable">
                        <tbody>${fieldsEl}</tbody>
                    </table>`;
                errorTrail.pop();
                return result ;
            }
            else{
                throw {msg:'what is this ???'};
            }
        }
    }
};

export const activate_block = ( clickedEl )=>{
    //// 클릭한 요소만 클래스 'on', 나머지에서는 클래스 'on' 제거
    for( let prevSelected 
            of get_docEl_blockList().querySelectorAll('.on') )
    {
        prevSelected.classList.remove('on');
    }

    clickedEl.classList.add('on');
}

export const save = ()=>{
    let result = [];
    let i = 0;
    for( let blockEl of get_docEl_blockList().children ){
        i++;
        try{
            result.push( block_to_jsonObj( blockEl ) );
        }catch( err ){
            console.error( i +'번 블록 실패 ... ', blockEl);
            alert( i +'번 블록 실패');
            return;
        }
    }
    let resultJsonStr = JSON.stringify( result, null, 4 );
    text_to_fileDownload( resultJsonStr , 'content-data.json' );

    function block_to_jsonObj( blockEl ){
        const blockType = blockEl.dataset.blocktype;
        const result = {
            type : blockType ,
            data : get_exporter( blockType )( blockEl.querySelector('.editor') )
        };
        return result;
    }
}


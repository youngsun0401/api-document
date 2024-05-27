let blockList ;
const docEl_blockList = document.getElementById('blockList');

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
        console.error('failed to get data ... ', err);
        alert('failed to get data');
    });
}

function render_blockList(){
    let renderedContent = '';
    for( let block of blockList ){
        let title = block.data.title;
        renderedContent += `
            <li class="block blockType-${block.type}"
                    onclick="roomModule.activate_block(this)"
                    data-blocktype="${block.type}">
                <p class="blockHead">
                    <span class="type">${block.type}</span>
                    <span class="title">${title == null ? '' : title}</span>
                </p>
                <div class="editor">${getEditor( block )}</div>
            </li>`;
    }
    docEl_blockList.innerHTML = renderedContent;

    function getEditor( block ){
        let importer = get_importer( block.type );
        return importer( block );
    }
};

export const activate_block = ( clickedEl )=>{
    //// 클릭한 요소만 클래스 'on', 나머지에서는 클래스 'on' 제거
    for( let prevSelected 
            of docEl_blockList.querySelectorAll('.on') )
    {
        prevSelected.classList.remove('on');
    }

    clickedEl.classList.add('on');
}

export const save = ()=>{
    let result = [];
    let i = 0;
    for( let blockEl of docEl_blockList.children ){
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

const get_importer = ( blockType )=>{
    let importer = functionSet[blockType]?.importer;
    return importer != null
        ? importer
        : functionSet[''].importer;
}

const get_exporter = ( blockType )=>{
    let exporter = functionSet[blockType]?.exporter;
    return exporter != null
        ? exporter
        : functionSet[''].exporter;
}

const importer_onlyTitle = ( block )=>{
    return `<input class="onlyTitle" value="${ block.data.title }">`;
}
const exporter_onlyTitle = ( editorEl )=>{
    return editorEl.querySelector('input').value ;
}

const functionSet = {
    '': {// default
        importer: block => `<textarea>${JSON.stringify( block.data, null, 4 )}</textarea>`,
        exporter: editorEl => JSON.parse( editorEl.querySelector('textarea').value ),
    },
    'h2': {
        importer: importer_onlyTitle,
        exporter: exporter_onlyTitle,
    },
    'h3': {
        importer: importer_onlyTitle,
        exporter: exporter_onlyTitle,
    },
    'h4': {
        importer: importer_onlyTitle,
        exporter: exporter_onlyTitle,
    },
    'plainText': {
        importer: block => `<textarea>${ block.data }</textarea>`,
        exporter: editorEl => editorEl.querySelector('textarea').value ,
    }
}

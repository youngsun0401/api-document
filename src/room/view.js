import { render_api_basic } from './view/render_api_basic.js';

export const render_room = ()=>{
    fetch('content-data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        try{
            render_contents( data );
        }catch( err ){
            console.error('failed to render_contents ... ', err);
        }
    })
    .catch(err => {
        console.error('failed to get data ... ', err);
        alert('failed to get data');
    });
}

function render_contents ( data ){
    if( !typeCheck( data, 'Array' ) ) return ;

    const hn = {
        n: 0,
        h2 : 0,
        h3 : 0,
        h4 : 0,
        h5 : 0,
        step : function( n ){
            if( n==null || n<2 || n>5 ) return ;

            this.n = n;

            if( n == 2 ){
                this.h5 = 0; this.h4 = 0; this.h3 = 0; this.h2 += 1;
            }else if(this.n== 3 ){
                this.h5 = 0; this.h4 = 0; this.h3 += 1;
            }else if(this.n== 4 ){
                this.h5 = 0; this.h4 += 1;
            }else if(this.n== 5 ){
                this.h5 += 1;
            }
        },
        toString : function( n ){
            if( n == null ) n = this.n;

            if(this.n=== 2 ){
                return `${this.h2}`;
            }else if(this.n=== 3 ){
                return `${this.h2}-${this.h3}`;
            }else if(this.n=== 4 ){
                return `${this.h2}-${this.h3}-${this.h4}`;
            }else if(this.n=== 5 ){
                return `${this.h2}-${this.h3}-${this.h4}-${this.h5}`;
            }
            return `${this.h2}-${this.h3}-${this.h4}-${this.h5}`;
        },
        toSpan : function(n){
            if( n == null ) n = this.n;

            return `<span class="hn hn${this.n}">${this.toString()}</span>`;
        },
        getSpan5 : function(){
            return `<span class="hn hn5">${this.h5}</span>`;
        }
    };

    let i = 0;
    let renderedBlock = '';
    let renderedCharye = '';
    for( const block of data ){
        i += 1;
        let renderedContent;
        let pageBreak = false;

        const blockType = block.type;
        if( blockType == null ) continue;

        if( blockType === 'h2' ){
            hn.step(2);
            pageBreak = true;
            renderedContent = render_h( block.data , hn );
        }else if( blockType === 'h3' ){
            hn.step(3);
            pageBreak = true;
            renderedContent = render_h( block.data , hn );
        }else if( blockType === 'h4' ){
            hn.step(4);
            pageBreak = true;
            renderedContent = render_h( block.data , hn );
        }else{
            hn.step(5);
            if( blockType === 'api_basic' ){
                pageBreak = true;
                renderedContent = render_api_basic( block.data , hn );
            }else if( blockType === 'plainText' ){
                renderedContent = `<p>${rawText_to_html(block.data)}</p>`;
            }else{
                console.error('unknown blockType: '+blockType);
            }
        }

        renderedBlock += get_contentBlock( i, blockType, renderedContent, pageBreak );
        renderedCharye += get_charyeBlock( block.data , hn , i );
    }
    document.getElementById('charye').innerHTML = renderedCharye ;
    document.getElementById('contents').innerHTML = renderedBlock ;

    function get_charyeBlock( data , hn , i ){
        if( data.title != null ){
            return `
                <li><a href="#block-${i}">${hn.toString()}: ${data.title}</a></li>`;
        }else return '';
    }

    function get_contentBlock( i , blockType , renderedContent , pageBreak ){
        return `
            <div id="block-${i}" class="blockType-${blockType}${pageBreak?" pageBreak":""}">
                ${renderedContent}
            </div>`;
    }

    function render_h( data , hn ){
        return `<h${hn.n}>${hn.toSpan(hn.n)} ${data.title}</h${hn.n}>`;
    }
}
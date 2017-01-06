var templateConversation = '<li class="conversation-item conversation-from-person" data-conversation="person"><i class="conversation-avatar"></i><p class="conversation-text font-22">[#texto_pessoa#]</p></li><li class="conversation-item conversation-from-watson" data-conversation="watson"><i class="conversation-avatar"></i><p class="conversation-text font-22">[#texto_watson#]</p></li>';

var watsonPrevidencia = {
    config : {
        conversation : 0 ,
    } ,
    client : {
        message : null , 
        conversationId : null
    } ,
    watson : {
        message : null ,
    } ,
    actions : {
        insertMessage : function() {
            
            var text = templateConversation;
            text = text.replace( '[#texto_pessoa#]' , watsonPrevidencia.client.message );
            text = text.replace( '[#texto_watson#]' , watsonPrevidencia.watson.message.text );
            
            watsonPrevidencia.client.conversationId = watsonPrevidencia.watson.message.conversationId;
            
            watsonPrevidencia.config.conversationList.innerHTML += text;
            watsonPrevidencia.config.conversationList.scrollTop = watsonPrevidencia.config.conversationList.scrollHeight; 
        } ,
        callWatson : function( method , params , callback ){
            var ajax = new XMLHttpRequest();
            
            ajax.onreadystatechange = function() {

                if (this.readyState == 4 && this.status == 200 && callback ) {
                    watsonPrevidencia.watson.message = JSON.parse( this.responseText );
                    if( callback ) callback();
                }
            };
            
            ajax.open( method , "/api" , true );
            ajax.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            ajax.send( JSON.stringify( params ) );
        } ,
        startConversation : function(){
            watsonPrevidencia.config.conversation = true;
            if ( watsonPrevidencia.elements.query( '[data-status="initial"]' ) ) {
                watsonPrevidencia.elements.query( '[data-status="initial"]' ).dataset.status = 'started';
            }
            
            watsonPrevidencia.actions.insertMessage();
        }
    } ,
    events : {
        init : function(){
                watsonPrevidencia.config.conversationList = watsonPrevidencia.elements.query( '[data-conversation="list"]' );
                watsonPrevidencia.elements.query( '[data-input]' ).onchange = function(){
                
                watsonPrevidencia.client.message = this.value;
                this.value = "";
                
                var callback = !watsonPrevidencia.config.conversation ? watsonPrevidencia.actions.startConversation : watsonPrevidencia.actions.insertMessage;
                
                watsonPrevidencia.config.conversation += 1; 
                watsonPrevidencia.actions.callWatson( 'post' , watsonPrevidencia.client , callback )
            }
        }
    } ,
    functions : {
        
    } ,
    elements : {
        query : function( queryParam ){
            return document.querySelector( queryParam );
        } ,
        queryAll : function( queryParam ){
            return document.querySelectorAll( queryParam );
        }
    } ,
    init : function(){
        watsonPrevidencia.events.init();
    }
}

watsonPrevidencia.init();
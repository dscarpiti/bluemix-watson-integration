var express = require('express');
var app = express();
var path = require('path');
var bodyParser  = require( 'body-parser' );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended : false } ) );

app.use('/', express.static( __dirname + '/app/') );
app.set( "views" , __dirname + '/app/' );

app.get( '/' , function( req , res ) {
  res.sendFile( 'index.html' );
  res.end();
});

app.post( '/api' , function( req , res , next ){
  
  res.setHeader("Content-Type", "application/json");
  
  // pega mensagem do cliente
  var clientConversation = req.body.message;
  var conversationId = req.body.conversationId;

  // instancia conversa
  // var watson = require( 'watson-developer-cloud' );
  var ConversationV1 = require( 'watson-developer-cloud/conversation/v1' );
  var conversation = new ConversationV1({
    url : "https://gateway.watsonplatform.net/conversation/api" ,
    username : 'e5248a5d-1bc0-427b-9a2d-dd105e5cf995', // replace with username from service key
    password : 'UGhpmQKSJ2v8', // replace with password from service key
    path : { workspace_id : '062a634e-0c25-48dd-b45d-634344d3e442' }, // replace with workspace ID
    version_date : '2017-01-06'
  });
  
  // inicia conversa com mensagem vazia
  var keepConversation = conversationId ? { 
    context : { 
      conversation_id : conversationId 
    } ,
    input : {
      text : clientConversation
    }
  } : {};

  conversation.message( keepConversation , processResponse );

  // Process the conversation response.
  function processResponse(err, response) {
    
    // res.setHeader( 'Content-Type' , 'application/json' );

    if (err) {
      console.error(err); // something went wrong
      return;
    }

    var endConversation = false;

    console.log( response );
    console.log('----------------------------------------------------------');
    
    var watsonMessage = {
      text : response.output.text[ 0 ] ,
      conversationId : response.context.conversation_id
    };
    
    // Check for action flags.
    if ( response.output.action === 'end_conversation' ) {
      // User said goodbye, so we're done.
      // res.write( response.output.text[0] );
      return res.send( watsonMessage );
      endConversation = true;
    } 
    else {
      // Display the output from dialog, if any.
      if ( response.output.text.length != 0 ) {
          // res.write( response.output.text[0] );
          return res.send( watsonMessage );
          
      }
    }
  
    // If we're not done, prompt for the next round of input.
    if ( !endConversation && clientConversation ) {
      conversation.message({
        input: { text: clientConversation },
        // Send back the context to maintain state.
        context : response.context,
      }, processResponse )
        
    }
    
    // res.send();
  }
  
});

app.listen( process.env.PORT  || 3000 );
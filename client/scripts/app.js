var renderMessageTemplate = "<p class='room'>Roomname: <%= roomname %></p><p class='user'>User: <%= username %></p><p class='message'> <%= text %></p><p class='time'>Time: <%= createdAt %>";

var url = 'https://api.parse.com/1/classes/chatterbox'; 

var renderChat = function(result){
  $('<li></li>').html(_.template(renderMessageTemplate, result)).appendTo('.chats');  
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

var postMessage = function(message){
  $.ajax({
    url: url,
    type: 'POST',
    data: message,
    contentType: 'application/json',
    success: function(data){
      console.log('success', data);
    },
    error: function(data){
      console.log('error', data);
    }
  });
};

var getMessages = function(){
  $.getJSON(url, {order: '-createdAt'}, parseGet);
};

var roomname = 'testING';

var createMessage = function(message){
  postMessage(
    JSON.stringify({
      username: username,
      text:     message,
      roomname: roomname
    })
  );
};
$('.sendMessage').on('submit', function(e){
  e.preventDefault();
  createMessage($('input[name="message"]').val());
});

$(document).ready(function(){
  var username = window.location.search.split('=')[1];
  getMessages();
  $('.username').text('Hello, @'+username); 
  $('.getNewMessages').on('click', function(e){
    e.preventDefault();
    getMessages();
  });
});

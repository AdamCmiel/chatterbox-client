var url = 'https://api.parse.com/1/classes/chatterbox';
var username = window.location.search.split('=')[1];

var renderChat = function(data) {
    var $li = $('<li></li>');
    var $username = $('<p class="name"></p>').text('User: @' + data.username);
    var $chatroom = $('<p></p>').text('Room: -' + data.roomname);
    var $date = $('<p></p>').text('Date: ' + data.createdAt);
    var $message = $('<p></p>').text(data.text);
    $li.append($username)
        .append($chatroom)
        .append($date)
        .append($message);
    $('.chats').append($li);
};

var parseGet = function(data) {
    var results = data.results;
    _.each(results, function(result) {
        renderChat(result);
    });
};

var postMessage = function(message) {
    $.ajax({
        url: url,
        type: 'POST',
        data: message,
        contentType: 'application/json',
        success: function(data) {
            console.log('success', data);
        },
        error: function(data) {
            console.log('error', data);
        }
    });
};

var getMessages = function(options) {
    options || (options = {
        order: '-createdAt',
        limit: 1000
    });
    $.getJSON(url, options, parseGet);
};

var roomname = 'testING';

var createMessage = function(message) {
    postMessage(
        JSON.stringify({
            username: username,
            text: message,
            roomname: roomname
        })
    );
};

$(document).ready(function() {
    var username = window.location.search.split('=')[1];
    var roomname = '4chan';
    getMessages();
    $('.username').text('Hello, @' + username);
    $('.getNewMessages').on('click', function(e) {
        e.preventDefault();
        getMessages();
    });
    $('form').submit(function(e) {
        e.preventDefault();
        createMessage($('input[name="message"]').val());
    });
});
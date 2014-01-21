var url = 'https://api.parse.com/1/classes/chatterbox';
var username = window.location.search.split('=')[1];
var chatRooms = {};

var renderChat = function(data) {
    var $li = $('<li></li>');
    var $username = $('<p class="name"></p>').text('User: @' + data.username);
    var $chatroom = $('<p></p>').text('Room: ' + data.roomname);
    var $date = $('<p></p>').text('Date: ' + moment(data.createdAt).fromNow());
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

var getMessages = function(options, callback) {
    options || (options = {
        order: '-createdAt',
        limit: 1000
    });
    callback || (callback = parseGet);
    $.getJSON(url, options, callback);
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

var checkRooms = function() {
    var addRoom = function(roomname) {
        if (roomname === 'undefined' ||
            roomname === undefined ||
            roomname === 'null' ||
            roomname === null ||
            roomname === "" ||
            chatRooms[roomname]) {
            //doNothing
        } else {
            console.log(chatRooms);
            chatRooms[roomname] = roomname;
            var $newOption = $('<option value=' + JSON.stringify(roomname) + '></option>').text(roomname);
            $('.chatRooms').append($newOption);
        }
    };
    getMessages(undefined, function(data) {
        _.each(data.results, function(result) {
            addRoom(result.roomname);
        });
    });
};

$(document).ready(function() {
    var username = window.location.search.split('=')[1];
    var roomname = '4chan';
    getMessages();
    checkRooms();
    $('.username').text('Hello, @' + username);
    $('.getNewMessages').on('click', function(e) {
        e.preventDefault();
        getMessages();
    });
    $('form').submit(function(e) {
        e.preventDefault();
        createMessage($('input[name="message"]').val());
    });
    $('select').on('change', function(e) {
        e.preventDefault();
        roomname = $('select option:selected').val();
        $('.chatRoomLabel').text('Welcome to chatroom: ' + roomname);
    })

});
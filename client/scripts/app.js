var url = 'https://api.parse.com/1/classes/chatterbox';
var username = window.location.search.split('=')[1];
var chatRooms = {};
var count = 0;
var lastGet = [];

var renderChat = function(data) {
    var $li = $('<li>' + count + '</li>');
    count++;
    var $username = $('<p class="name"></p>').text('User: @' + data.username);
    var $chatroom = $('<p></p>').text('Room: ' + data.roomname);
    var $date = $('<p></p>').text('Date: ' + moment(data.createdAt).fromNow());
    var $message = $('<p></p>').text(data.text);
    $li.append($username)
        .append($chatroom)
        .append($date)
        .append($message);
    $('.chats').append($li).hide().fadeIn();
};

var parseGet = function(data) {
    var results = data.results;
    if (_.isEqual(lastGet[0], results[0])) {
        //do nothing
    } else {
        lastGet = results;
        $('.chats').html("");
        _.each(results, function(result) {
            renderChat(result);
        });
    }
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
    count = 0;
    options || (options = {
        order: '-createdAt',
        limit: 100
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
            roomname === 'null' ||
            roomname === "" ||
            typeof roomname !== 'string' ||
            chatRooms[roomname]) {
            //doNothing
        } else {
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
    var friends = [];
    setInterval(getMessages, 1000);
    checkRooms();
    $('.username').text('Hello, @' + username);
    $('.getNewMessages').on('click', function(e) {
        e.preventDefault();
        console.log(roomname);
        var query = 'where={"roomname":' + roomname + '}';
        // getMessages(query);
        getMessages('limit=50');
    });
    $('form').submit(function(e) {
        e.preventDefault();
        createMessage($('input[name="message"]').val());
    });
    $('select').on('change', function(e) {
        e.preventDefault();
        roomname = $('select option:selected').val();
        $('.chatRoomLabel').text('Welcome to chatroom: ' + roomname);
    });
    $('.name').delegate('click', function(e) {
        alert('yo');
        e.preventDefault();
        friends.push(this.text());
        this.addClass('friend');
        console.log(friends);
    });

});
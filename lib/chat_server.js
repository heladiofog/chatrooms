// Socket.IO server functionality
var socketio = require(socket.io);
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// Connection-handling logic
exports.listen = function (server) {
    io = socketio.listen(server);   // staty Socket.IO server, allows it to piggyback on HTTP existing server
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {  // defines how each user connection will be handled
        // assign user a guest name when they connect
        guestNumber = assignGuestName(socket, guestNumber, nicknames, namesUsed);
        // palces user in the Lobby room when they connect
        joinRoom(socket, 'Lobby');
        // handle user messages, name attempts, and room creation/changes
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        // provide use with list of occupied rooms on request
        socketio.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        // define cleanup logic for when client disconnects
        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};

/* Helper functions */
//Assining guest names
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    // generate guest name
    var name = 'Guest' + guestNumber;
    // associate guest name with client connection ID
    nickNames[socket.id] = name;
    // let the user know their guest name
    socket.emit('nameResult', {
        success: true,
        name = name
    });
    // note that guest user name is now used
    namesUsed.push(name);
    // increment counter to generate guest names
    return guestNumber + 1;
}

//Joining rooms
function joinRoom(socket, room) {
    // make user join a room
    socket.join(room);
    // note that user is now in this room
    currentRoom[socket.id] = room;
    // let user know they are now in new room 
    socket.emit('joinResult', {room: room});
    // let other users in room know that user has joined 
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });
    // determine what others users are in the room
    var usersInRoom = io.sockets.clients(room);
    // If other users exist, summarize who they are
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        // sends summary of other users in the room to the user
        socket.emit('message', {text: usersInRoomSummary});
    }
}

//Handling name-change requests
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    // 
}

//Handling message broadcasting
function handleMessageBroadcasting(socket, nickNames) {
    // 
}
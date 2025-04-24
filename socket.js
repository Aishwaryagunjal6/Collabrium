const socketIo = (io)=>{
  //store connected users with their room information using socket.id as their key 
  const connectedUsers = new Map()
  //handle new socket connections/
  io.on('connection', (socket)=>{
    // get user from authentication
    const user = socket.handshake.auth.user
    console.log("User connected", user?.username)

    // START: join room handler
    socket.on("join room" , (groupId)=>{
      // Add socket to the specified room
      socket.join(groupId);
      // Store user and the room info in the connected user map
      connectedUsers.set(socket.id, {user, room:groupId})
      // get list of all users in the room
      const usersInRoom = Array.from(connectedUsers.values()).filter((u)=> u.room === groupId).map((u)=> u.user)

      // Emit updates users list to all clients in the room
      io.in(groupId).emit('users in room', usersInRoom)

      // brodcast join notification to all users in the group
      socket.to(groupId).emit('notification', {
        type: 'USER_JOINED',
        message: `${user?.username} has joined`,
        user: user
      })
    })
  })
}

module.exports = socketIo
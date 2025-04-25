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


    // START: Leave room handler
    socket.on('leave room', (groupId)=>{
      console.log(`${user.username} Leaving room`, groupId)
      // Remove socket from the room
      socket.leave(groupId)
      if(connectedUsers.has(socket.id)){
        // Remove user from connectedUsers and notify others
        connectedUsers.delete(socket.id)
        socket.to(groupId).emit('user left', user?._id)
      }
    })


    // START:Sending new messages
    socket.on("new message", (message)=>{
      // Broadcast message to all added users in the group
       socket.to(message.groupId).emit('message received', message)
    })


    // START: Disconnecting handler. (This event will trigger when the user disconnects from the group)
    socket.on('disconnect', ()=>{
      console.log(`${user?.username} disconnected from the group`)
      if(connectedUsers.has(socket.id)){
        // get users room info before removing
        const userData = connectedUsers.get(socket.id)
        // Notify others in the room 
        socket.to(userData.room).emit('user left', user._id)
        // Remove user from connected users
        connectedUsers.delete(socket.id)
      }
    })


    // START: Typing Indicator
    // Gets triggered when user starts typing
    socket.on("typing", ({groupId , username})=>{
      // Broadcast the typing status to other users in the group
      socket.to(groupId).emit("user typing", {username})
    })

    socket.on("stop typing", ({groupId})=>{
      // Broadcast the typing status to other users in the group
      socket.to(groupId).emit("user stop typing", {username : user?.username})
    })
  })
}

module.exports = socketIo
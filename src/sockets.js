export default (io) => {
  var line_history = [];

  io.on("connection", (socket) => {
    console.log("new User Connection");

    // Solicitar al cliente que envíe su nombre de usuario
    socket.emit("requestUsername");

    socket.on("setUsername", (username) => {
      socket.username = username;
      console.log(`Usuario ${username} autenticado.`);

      // Notificar a todos los clientes conectados sobre el nuevo usuario
      io.emit("userAuthenticated", username);

      // Enviar el historial de líneas al nuevo usuario
      for (const i in line_history) {
        socket.emit("draw_line", { username: "Server", line: line_history[i] });
      }
    });

    socket.on("draw_line", (data) => {
      // Agregar el nombre de usuario a los datos
      data.username = socket.username;
      line_history.push(data.line);
      // Emitir el evento para que también tengan los datos enviados
      io.emit("draw_line", data);
    });
  });
};

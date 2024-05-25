// Importaciones necesarias
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import http from "http";
import { Server } from "socket.io";
import initializeSockets from "./sockets.js"; // Importa la función initializeSockets desde sockets.js

// Inicialización de la aplicación Express
const app = express();
const server = http.createServer(app)
const io = new Server(server);

// Configuración del puerto
const port = 3000;
app.set("port", process.env.PORT || port);

// Inicializar sockets
initializeSockets(io); // Llama la función initializeSockets y pasa la instancia de io

// Middlewares y configuraciones adicionales
// ...

// Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Rutas y otras configuraciones
// ...

// Inicio del servidor
server.listen(app.get("port"), () => {
  console.log(`Servidor escuchando en el puerto ${app.get("port")}`);
});
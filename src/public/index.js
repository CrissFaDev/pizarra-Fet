document.addEventListener("DOMContentLoaded", init);

// Variable para almacenar el color seleccionado
let currentColor = "black"; // Color por defecto

// Función para inicializar el canvas y la lógica de dibujo
function init(params) {
    let mouse = {
        click: false,
        move: false,
        pos: { x: 0, y: 0 },
        post_prev: false,
    };

    // Obtener el canvas
    let canvas = document.getElementById("drawing");

    // Obtener el contexto del canvas
    let ctx = canvas.getContext("2d");

    // Obtener las dimensiones del canvas
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Establecer las dimensiones del canvas
    canvas.width = width;
    canvas.height = height;

    const socket = io();

    // Pedir nombre de usuario al conectar
    const username = prompt("Por favor, ingresa tu nombre de usuario:");
    socket.emit("setUsername", username);

    // Bandera para controlar si el nombre de usuario ya se mostró en la línea actual
    let usernameDisplayed = false;

    // Eventos del canvas
    // Presionar el mouse en el canvas
    canvas.addEventListener("mousedown", (e) => {
      mouse.click = true;
  
      // Mostrar el nombre del usuario
      const tempFontSize = 16;
      ctx.font = `${tempFontSize}px Arial`;
      ctx.fillStyle = currentColor;
      ctx.fillText(username, e.clientX, e.clientY);
      usernameDisplayed = true;
  
      // Enviar el evento al servidor para que otros usuarios vean el nombre
      socket.emit("draw_line", { line: [{ x: e.clientX / width, y: e.clientY / height }, { x: e.clientX / width, y: e.clientY / height }], username: username, color: currentColor });
  });
  

    // Soltar el mouse en el canvas
    canvas.addEventListener("mouseup", (e) => {
        mouse.click = false;
        usernameDisplayed = false; // Reiniciar la bandera para la próxima línea
    });

    // Mover el mouse en el canvas
    canvas.addEventListener("mousemove", (e) => {
        mouse.move = true;
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
    });

    canvas.addEventListener("mouseout", (e) => {
        mouse.move = false;
    });

    // Recibir eventos de dibujo desde el servidor
    socket.on("draw_line", (data) => {
        const line = data.line;

        // Dibujar la línea en el canvas
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = data.color;
        ctx.moveTo(line[0].x * width, line[0].y * height);
        ctx.lineTo(line[1].x * width, line[1].y * height);
        ctx.stroke();

        // Mostrar el nombre del usuario solo si no se ha mostrado antes en esta línea
        if (!usernameDisplayed) {
            const tempFontSize = 16;
            ctx.font = `${tempFontSize}px Arial`;
            ctx.fillStyle = data.color;
            ctx.fillText(data.username, line[0].x * width, line[0].y * height);
            usernameDisplayed = true;
        }
    });

    // Función principal del bucle
    function mainLoop() {
        if (mouse.click && mouse.move && mouse.post_prev) {
            socket.emit("draw_line", { line: [mouse.pos, mouse.post_prev], username: username, color: currentColor });
            mouse.move = false;
        }
        mouse.post_prev = { x: mouse.pos.x, y: mouse.pos.y };
        setTimeout(mainLoop, 25);
    }

    mainLoop();
}

// Función para limpiar la pizarra
function limpiarPizarra() {
    const canvas = document.getElementById("drawing");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
}

// Función para cambiar el color de dibujo

function changeColor(color) {
  currentColor = color;
}


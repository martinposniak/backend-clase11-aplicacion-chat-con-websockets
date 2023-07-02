// CREACIÓN DEL SOCKET:
// Ahora lo que debemos hacer es LEVANTAR E INSTANCIAR(CREAR) el socket, porque nosotros ya hemos creado la importación del lado DEL CLIENTE.
// Para poder instanciar(crear) el socket, vamos a crear una constante que vamos a llamar 'socket' y le vamos a asignar la palabra reservada 'io()'. Al utilizar la palabra reservada 'io()', nos permite instanciar(crear) el socket y guardarlo dentro nuestra constante 'socket' y es el que utiliza para poderse conectar entre EL CLIENTE y EL SERVIDOR.
// Recordemos que en este caso, nosotros somos EL CLIENTE por lo que representamos por una vista que es el 'index.handlebars' que estamos teniendo en nuestro proyecto.
const socket = io();
// io hace referencia a 'socket.io', se le llama asi por convención.
// La linea 5 permite instanciar(crear) el socket y guardarlo en la constante 'socket'
// Dicho socket es el que utilizaremos para poder comunicarnos con el socket del servidor.
// (Recuerda que, en este punto somos CLIENTES, porque representamos una vista)

// Ahora vamos a crear un usuario:
// Vamos a crear una variable que vamos a llamar 'user' para que podamos capturar la información de este usuario con el que podamos identificar quien escribe dicho mensaje:
let user;

// Ahora vamos a crear el chat que nos va a permitir idenfiticar donde va a obtener el dato nuestro usuario.
let chatBox = document.getElementById("chatBox");

// Ahora vamos a implementar sweetalert2
// Ver toda la documentación en la pagina oficial: https://sweetalert2.github.io/
Swal.fire({
  title: "Bienvenido a nuestro chat !!",
  input: "text",
  text: "Ingresa por favor tu nombre: ",
  inputValidator: (value) => {
    return !value && "Se requiere un nombre para continuar";
  },
  allowOutsideClick: false, // El 'allowOutsideClick: false' lo que hace es que NO te permite salir de la pantalla si no has digitado el mensaje. Si el valor fuese 'true', SI te permite salir de la pantalla si no has digitado el mensaje.
}).then((resultado) => {
  user = resultado.value;
});

// Ahora vamos a colocarle un evento al socket para que cuando nosotros (EL SERVIDOR) leamos ese mensaje DEL CLIENTE, NOSOTROS (EL SERVIDOR) lo podamos enviar.
chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

// Ahora le vamos a decir que este socket va a leer todo lo que llegue en los mensajes que creamos de la linea 66 a 76 de nuestra apps.js
socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";

  data.forEach((message) => {
    messages = messages + `${message.user} dice : ${message.message} </br>`;
  });
  log.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  if (!user) return;
  Swal.fire({
    text: "Nuevo usuario conectado",
    toast: true,
    position: "top-right",
  });
});
// CHAT WEBSOCKET AMPLIADO:
// Con base en el servidor con chat de websocket que se ha desarrollado. Crear nuevos eventos para que:

// Cuando el usuario se autentique correctamente, el servidor le mande los logs de todo el chat.
// Cuando el usuario se autentique correctamente, todos los demás usuarios (menos el que se acaba de registrar) reciban una notificación indicando qué usuario se acaba de conectar. (utiliza Swal toast).

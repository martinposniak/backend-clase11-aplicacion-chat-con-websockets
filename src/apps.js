// APLICACIÓN CHAT CON WEBSOCKET:

// Como aprendimos la clase pasada, las aplicaciones de websocket son bastante amplias. Una de las mejores formas de comprender su aplicación, es realizando un chat comunitario.

// Nuestro chat comunitario contará con:

// Una vista que cuente con un formulario para poder identificarse. El usuario podrá elegir el nombre de usuario con el cual aparecerá en el chat.
// Un cuadro de input sobre el cual el usuario podrá escribir el mensaje.
// Un panel donde todos los usuarios conectados podrán visualizar los mensajes en tiempo real
// Una vez desarrollada esta aplicación, subiremos nuestro código a glitch.com, para que todos puedan utilizarlo.

// Ahora bien, luego de haber instalado la dependencia 'express-handlebars', ahora nosotros vamos a empezar a configurar nuestro motor de plantillas desde el express.
// Acá vamos a importar el express, los handlebars y el dirname.

import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.router.js";
import { Server } from "socket.io"; // Recuerda que este { Server } es propio de websockets.

// Ahora vamos a crear la constante para poder inicializar nuestro servidor.
const app = express();

// Y ahora vamos a levantar nuestro servidor.
// Ahora bien, recordemos que nosotros tenemos que levantar el servicio y el end point sobre el que vamos a trabajar. En este caso, a mi app le vamos a pasar el metodo '.listen()' para que mi app pueda escuchar las peticiones que a partir del puerto que yo defina. Generalmente se utiliza el puerto 8080. Ahora bien, si en algun punto nosotros tenemos el puerto 8080 utilizado por otra aplicación, y nosotros intentamos levantarlo, el sistema nos va a decir que tenemos un error, ya que hay otro servidor que lo está utilizando. En ese caso, lo que se puede hacer es, en vez de utilizar el puerto 8080, podemos utilizar el puerto 3000. Pero lo normal es que utilicemos el puerto 8080.
// ENTONCES, dentro del método 'listen()' va a recibir 2 parámetros: el 1er parámetro es el puerto 8080, simplemente escribiendo el numero '8080', entonces lo que le estoy diciendo acá es que el método 'listen' va a empezar a escuchar las peticiones del puerto 8080. El 2do parámetro es una callback, donde le vamos a decir que, cuando nos levante el servidor, con el puerto 8080, nos diga un mensaje. Y dicho mensaje va a decir 'Servidor Arriba'.
const httpserver = app.listen(8080, () => {
  console.log("Server arriba");
});

// Ahora bien, nosotros vamos a tener que levantar el socket del server para poder empezar a trabajar directamente. Por eso le pusimos 'htppserver' para levantar nuestro servidor.
// Lo que vamos a hacer acá es crear el socket del servidor, como una constante que vamos a llamar 'io' y le vamos a decir que va a inicializar un servidor, a partir de este 'httpserver' que nosotros hemos creado anteriormente.
// Seguramente estás pensando: “¿Por qué ahora socketServer se llama ‘io’?”
// El nombre, como sabrás, no influye en nada, sólo queremos mostrarte el nombre con el que se recomienda nombrarlo “por convención”. Es decir, queremos que te acostumbres al nombre que encontrarás en otros proyectos.

// const io = new Server(httpserver); // io será un servidor para trabajar con sockets.

const io = new Server(httpserver);

// Configuramos todo lo referente a plantillas:
//app.engine("handlebars", handlebars.engine()); // Esto nos permite implementar las plantillas desde nuestro código.
//app.set("views", __dirname + "/views"); // Estas son las vistas para poder saber cuales eran las url(rutas) donde podemos identificar los handlebars.
//app.set("view engine", "handlebars"); // Estas son las vistas para poder saber cuales eran las url(rutas) donde podemos identificar los handlebars.
//app.use(express.static(__dirname + "/public")); // Esta es la parte estática para poder identificar cuales son los archivos (css y js) que nosotros podamos tener en nuestra carpeta 'public'
//app.use("/", viewRouter);

// Ahora le vamos a decir a nuestra app, que el motor con el que va a trabajar será el 'handlebars'.
// Con esta linea de código, nuestro servidor ya entiende cual va a ser el motor que va a utilizar para poder demostrar las vistas y cual es la instancia con la que el trabaja.
app.engine("handlebars", handlebars.engine());

// Ahora le vamos a decir que va a agarrar toda la información de lo que esté en las vistas (views) y va a poderlas involucrar dentro de las rutas con las que nosotros estemos trabajando. Entonces, con la siguiente linea de código le estamos diciendo cuales son las vistas con las que estas trabajando con los motores.
// Es decir, con esta linea de codigo, le estamos diciendo a nuestra app donde vas a ir a buscar las rutas.
app.set("views", __dirname + "/views");

// Con esta linea de codigo tambien le estamos diciendo a nuestra app que inicialize las vistas como tal con los handlebars para que tenga que hacerlo directamente con ese motor.
// IMPORTANTE: Recordemos que el motor es el 'handlebars'.
app.set("view engine", "handlebars");

// Y ahora vamos a setear nuestra carpeta 'public' para que pueda tomar los cambios y los pueda utilizar.
// Recuerda que esto es importante para tener archivos css y js en plantillas.
app.use(express.static(__dirname + "/public"));

app.use("/", viewRouter);

// Ahora vamos a crear el array del mensaje 'message' para que podamos guardar la información de todos los datos que nos lleguen.
let messages = [];

io.on("connection", (socket) => {
  console.log("Tenemos un cliente conectado");

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
    console.log(data);
  });

  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });
});

export { app, io };

/*
// Ahora lo que vamos a hacer es comportarnos como SERVIDOR. Es decir, cada vez que el index intente hacer el llamado de nuestro SERVIDOR, entonces nosotros vamos a escuchar esa conexión. Para que nosotros (EL SERVIDOR) podamos escuchar esa conexión, debemos pasarle, a nuestra variable que hemos creado previamente mas arriba como constante 'socketServer' el método '.on()' Con esta palabra reservada 'on()' vamos a poder escuchar la conexión.
socketServer.on(); // El método '.on()' le permite AL SERVIDOR, ESCUCHAR y RECIBIR la información que nos llegue de nuestro CLIENTE.
socketServer.emit(); // El método '.emit()' le permite AL SERVIDOR, HABLAR y ENVIAR la información AL CLIENTE.
*/

//socket.emit()--> El método '.emit()' le permite AL SERVIDOR, HABLAR y ENVIAR la información AL CLIENTE.
// |
// |
// V
//socket.on()--> El método '.on()' le permite AL SERVIDOR, ESCUCHAR y RECIBIR la información que nos llegue del CLIENTE.

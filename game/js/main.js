// Objetos importantes de canvas // iniciales

var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

// Crear el objeto de la nave
var spaceShip = {
  x:100,
  y: canvas.height-100,
  width: 50,
  height: 50
}

var keyboard = {

}
// Definir variables para las imágenes 
var background;

// Definición de funciones
function loadMedia() {
  background = new Image();
  background.src = './assets/img/space1.jpg';
  background.onload = function() {
    var intervalo = window.setInterval(frameLoop,100/55);
  }
}

function drawBackground() {
  ctx.drawImage(background,0,0);
}

function drawSpaceShip() {
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.fillRect(spaceShip.x,spaceShip.y,spaceShip.width,spaceShip.height);
  ctx.restore();
}

function AddKeyboardsEvents() {
  addEvent(document,"keydown", function(e) {
    // ponemos en true la tecla presioanda
    keyboard[e.keyCode] = true;
  });

  addEvent(document,"keyup", function(e) {
    // ponemos en true la tecla presioanda
    keyboard[e.keyCode] = false;
  });

  function addEvent(element, eventName, funcion) {
    if (element.addEventListener) {
      element.addEventListener(eventName, funcion, false);
    } else if(element.attachEvent) {
      // IE
      elemento.attachEvent(eventName,  funcion);
    }
  }
}

// frameLoop = actualizar posiciones jugadores | dibujar el background
function frameLoop() {
  drawBackground();
  drawSpaceShip();
}

// Ejecución de funciones
loadMedia();
AddKeyboardsEvents();
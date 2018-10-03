// Objetos importantes de canvas // iniciales

var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

// Definir variables para las imágenes 
var fondo;

// Definición de funciones
function loadMedia() {
  fondo = new Image();
  fondo.src = './assets/img/space1.jpg';
  fondo.onload = function() {
    var intervalo = window.setInterval(frameLoop,100/55);
  }
}

function drawBackground() {
  ctx.drawImage(fondo,0,0);
}

// frameLoop = actualizar posiciones jugadores | dibujar el background
function frameLoop() {
  drawBackground();
}

// Ejecución de funciones
loadMedia();
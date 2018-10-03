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

var game = {
  state: 'iniciando'
};


var keyboard = {}
//Array para los disparos
var shots = [];
// Array enemgios
var enemies = [];
// Definir variables para las imágenes 
var background;

// Definición de funciones
function loadMedia() {
  background = new Image();
  background.src = './assets/img/space1.jpg';
  background.onload = function() {
    // 1000/55 || 100/55;
    var intervalo = window.setInterval(frameLoop,400/55);
  }
}

function drawEnemies() {
  for(var i in enemies) {
    var enemy = enemies[i];
    ctx.save();
    if (enemy.state == 'alive') {
      ctx.fillStyle = 'red';
    } else if(enemy.state == 'dead') {
      ctx.fillStyle = 'black';
    }
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
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

function moveSpaceship() {
  if(keyboard[37]) {
      // left
    spaceShip.x -= 7;
    if(spaceShip.x < 0) spaceShip.x = 0;
  } 
  else if(keyboard[39]) {
      // right
    var limite = canvas.width - spaceShip.width;
    spaceShip.x += 7;
    if(spaceShip.x > limite) spaceShip.x = limite;
  }

  if(keyboard[32]) {
    // Shots 
    if (!keyboard.fire) {
      fire();
      keyboard.fire = true;
    } 
    else {
      keyboard.fire = false;
    }
   
  }
}

function updateEnemies() {
   if (game.state == 'iniciando') {
      for (var i = 0; i < 10;  i++) {
         enemies.push({
            x: 10 + (i*50),
            y: 10,
            height:  40,
            width: 40,
            state: 'alive',
            counter: 0
         });
      }
      game.state = 'jugando';

   }
   for(var i in enemies) {
      var enemy = enemies[i];
      if(!enemy) continue;
      if(enemy && enemy.state == 'alive') {
            enemy.counter++;
            enemy.x += Math.sin(enemy.counter * Math.PI /90)*5;
      }
   }
}

function moveShots() {
  for(var i in shots) {
    var shot = shots[i];
    shot.y -= 2; 
  }
  shots = shots.filter(function() {
    return shot.y > 0;
  });
}

function fire() {
  shots.push({
    x: spaceShip.x + 20,
    y: spaceShip.y - 10,
    width: 10,
    height: 30
  })
}

function drawShots() {
  ctx.save();
  ctx.fillStyle = 'white';
  for(var i in shots) {
    var shot = shots[i];
    ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
  }
  ctx.restore();
}

// frameLoop = actualizar posiciones jugadores | dibujar el background
function frameLoop() {
    moveSpaceship();
    updateEnemies();
    moveShots();
    drawBackground();
    drawSpaceShip();
    drawEnemies();
    drawShots();
}

// Ejecución de funciones
loadMedia();
AddKeyboardsEvents();
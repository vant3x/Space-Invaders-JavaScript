// Objetos importantes de canvas // iniciales

var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

// Crear el objeto de la nave
var spaceShip = {
  x:100,
  y: canvas.height-100,
  width: 50,
  height: 50,
}

var game = {
  state: 'iniciando'
};


var keyboard = {}
//Array para los disparos
var shots = [];
// Array enemgios
var enemies = [];
// disparos enemigos 
var enemyShots = [];
// Definir variables para las imágenes 
var background;

// Definición de funciones
function loadMedia() {
  background = new Image();
  background.src = './assets/img/space1.jpg';
  background.onload = function() {
    // 1000/55 || 100/55;
    var intervalo = window.setInterval(frameLoop,450/55);
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

function drawEnemyShots() {
  for(var i in enemyShots) {
    var shot = enemyShots[i];
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.fillRect(shot.x, shot.y, shot.width, shot.height);
    ctx.restore();
  }
}

function moveEnemyShots() {
  for(var i in enemyShots) {
    var shot = enemyShots[i];
    shot.y += 3;
  }
  enemyShots = enemyShots.filter(function(shot){
    return shot.y < canvas.height;
  });
}

function updateEnemies() {
  function addEnemyShots(enemy) {
    return {
      x: enemy.x,
      y: enemy.y,
      width: 10,
      height: 33,
      counter: 0
    }
  }
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

            if(random(0,enemies.length * 10) == 4) {
              enemyShots.push(addEnemyShots(enemy))
            }
      }
      if(enemy && enemy.state == 'hit') {
        enemy.counter++;
        if(enemy.counter >= 20) {
          enemy.state = 'dead';
          enemy.counter = 0;
        }
      }
   }
   enemies = enemies.filter(function(enemy){
    if(enemy && enemy.state != 'dead') return true;
    return false;
   });
}



// movers disparos
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


// colisiones
function hit(a, b) {
  var hit = false;
  if(b.x + b.width >= a.x && b.x < a.x + a.width) {
    if(b.y + b.height >= a.y && b.y  < a.y + a.height) {
      hit = true;
    }
  }
  if(b.x <= a.x && b.x + b.width >= a.x + a.width) {
    if(b.y <= a.y &&  b.y + b.height >= a.height){
      hit = true;
    }
  }
  if(a.x < b.x && a.x + a.width >= b.x + b.width) {
    if(a.y <= b.y && a.y + a.height >= b.y + b.height) {
      hit = true;
    }
  }
  return hit;
}

function verificarContacto() {
  for(var i in shots) {
    var shot = shots[i];
    for(j in enemies) {
      var enemy = enemies[j];
      if(hit(shot,enemy)){
        enemy.state = 'hit';
        enemy.counter = 0;
        console.log('Hubo contacto');
      }
    }
  }
  if (spaceShip.state == 'hit' || spaceShip.state == 'dead') return;
  for(var i in enemyShots) {
    var shot = enemyShots[i];
    if(hit(shot,spaceShip)) {
      spaceShip.state = 'hit';
      console.log('contacto')
    }
  }
}

function random(bottom,top) {
  var possibilities = top - bottom;
  var randomNumb = Math.random() * possibilities;
  randomNumb = Math.floor(randomNumb);
  return parseInt(bottom) + randomNumb;
}

// frameLoop = actualizar posiciones jugadores | dibujar el background
function frameLoop() {
    moveSpaceship();
    moveShots();
    moveEnemyShots();
    drawBackground();
    updateEnemies();
    drawEnemies();
    drawEnemyShots();
    drawShots();
    drawSpaceShip();
    verificarContacto();
}

// Ejecución de funciones
loadMedia();
AddKeyboardsEvents();
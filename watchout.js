/*globals d3,_*/

// Game Configs
var width = 960;
var height = 540;
var enemySize = 15;
var enemySpeed = 1800;
var enemyMoveInterval = 2000;
var initEnemies = 10;
var enemySpawnTime = 1000;

// Stats
var score = 0;
var highScore = 0;
var collisions = 0;

var updateScore = function() {
  score += 1;
  d3.select(".current span")
    .html(score);
};

var clearScore = _.throttle(function () {
  if (highScore < score) {
    highScore = score;
    d3.select(".high span")
    .html(highScore);
  }
  score = -1;
  updateScore();
  collisions += 1;
  d3.select(".collisions span")
    .html(collisions * 165);
}, 1500);


// Build the game
var enemyHidingRoom = 2 * enemySize;
var min = 0 - enemyHidingRoom;
var xmax = width + enemyHidingRoom;
var ymax = height + enemyHidingRoom;

var svg = d3.select("#gameboard svg")
    .attr("width", width)
    .attr("height", height);

// Enemies
var numEnemies = initEnemies;

var generateEnemyPos = function () {
  var pos = {};
  pos.x = -enemyHidingRoom;
  pos.y = -enemyHidingRoom;
  var side = Math.floor(Math.random() * 4);
  var percentage = Math.random();
  if (side === 0 || side === 2) {
    pos.x = width * percentage;
  } else {
    pos.y = height * percentage;
  }
  if (side === 1) {
    pos.x = width + enemyHidingRoom;
  }
  if (side === 2) {
    pos.y = height + enemyHidingRoom;
  }
  this.x = pos.x;
  this.y = pos.y;
};

var updateEnemies = function () {
  svg.selectAll("circle.enemy")
    .each(generateEnemyPos)
    .transition()
    .duration(enemySpeed)
    .ease("linear-in-out")
    .attr("cx", function() {return this.x;})
    .attr("cy", function() {return this.y;});
  updateScore();
};

var createEnemies = function (data) {
  var enemies = svg.selectAll("circle")
      .data(data);

  enemies.enter().append("circle")
    .attr("class", "enemy")
    .attr("r", enemySize)
    .each(generateEnemyPos)
    .attr("cx", function() {return this.x;})
    .attr("cy", function() {return this.y;});

  enemies.exit().remove();
};

createEnemies(_.range(numEnemies));

setInterval(function() {
  updateEnemies();
}, enemyMoveInterval);

setInterval(function() {
  numEnemies++;
  createEnemies(_.range(numEnemies));
}, enemySpawnTime);

// Player
var player = svg.append("circle")
  .attr("class", "player")
  .attr("r", 31)
  .attr("cx", width / 2)
  .attr("cy", 40);

svg.on("mousemove", function() {
  var mouse = d3.mouse(this);
  d3.select(".player")
    .attr("cx", mouse[0])
    .attr("cy", mouse[1]);
});

var checkCollision = function (collidedCallback) {
  svg.selectAll("circle.enemy")
  .each(function() {
    var enemy = d3.select(this);
    var radiusSum =  parseFloat(enemy.attr("r")) + parseFloat(player.attr("r"));
    var xDiff = parseFloat(enemy.attr("cx")) - parseFloat(player.attr("cx"));
    var yDiff = parseFloat(enemy.attr("cy")) - parseFloat(player.attr("cy"));

    var separation = Math.sqrt( Math.pow(xDiff,2) + Math.pow(yDiff,2) );
    if (separation < radiusSum) {
      collidedCallback();
    }
  });
};

var onCollision = function () {
  player.transition()
    .attr("class", "player hit");
  setTimeout(function(){
    player.transition()
      .attr("class", "player");
  },1000);
  clearScore();
  numEnemies = initEnemies;
};

setInterval(function() {
  checkCollision(onCollision);
}, 30);

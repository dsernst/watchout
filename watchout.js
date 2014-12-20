/*globals d3,_*/
// start slingin' some d3 here.

// Game Configs
var width = 750;
var height = 500;
var enemySize = 25;

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
    .html(collisions);
}, 1500);


// Build the game
var enemyHidingRoom = 2 * enemySize;
var min = 0 - enemyHidingRoom;
var xmax = width + enemyHidingRoom;
var ymax = height + enemyHidingRoom;

var svg = d3.select("#gameboard svg")
    .attr("width", width)
    .attr("height", height);

var updateEnemies = function () {
  svg.selectAll("circle.enemy")
  .transition().duration(1000)
  .attr("cx", function(){return Math.random() * (xmax - min) + min;})
  .attr("cy", function(){return Math.random() * (ymax - min) + min;});
  updateScore();
};

var createEnemies = function (data) {
  var enemies = svg.selectAll("circle")
      .data(data);

  enemies.enter().append("circle")
    .attr("class", "enemy")
    .attr("r", enemySize);

  updateEnemies();
};

var drag = d3.behavior.drag()
  .on("drag", function() {
      var dragX = d3.event.x;
      var dragY = d3.event.y;
      if (dragX > 0 && dragX < width) {
        d3.select(this).attr("cx", d3.event.x);
      }
      if (dragY > 0 && dragY < height) {
        d3.select(this).attr("cy", d3.event.y);
      }
    });

var player = svg.append("circle")
  .attr("class", "david")
  .attr("r", 15)
  .attr("cx", width / 2)
  .attr("cy", 40)
  .call(drag);

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
  svg.transition()
    .attr("class", "hit");
  setTimeout(function(){
    svg.transition()
    .attr("class","");
  },90);
  clearScore();
};

var deathBalls = [1,2,3,4,5,6,7,8,9,10];

createEnemies(deathBalls);

setInterval(function() {
  updateEnemies();
}, 1500);

setInterval(function() {
  checkCollision(onCollision);
}, 30);

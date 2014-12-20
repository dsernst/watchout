/*globals d3*/
// start slingin' some d3 here.

// Game Configs
var width = 750;
var height = 500;
var enemySize = 25;

var xmin =  0 + enemySize;
var xmax =  height - enemySize;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var updateEnemies = function () {
  svg.selectAll("circle.enemy")
  .transition()
  .attr("cx", function(){return Math.random() * (width - 50);})
  .attr("cy", function(){return Math.random() * (xmax - xmin) + xmin;});
};

var create = function (data) {
  var enemies = svg.selectAll("circle")
      .data(data);

  enemies.enter().append("circle")
    .attr("class", "enemy")
    .attr("r", enemySize);

  updateEnemies();
};

var drag = d3.behavior.drag()
  .on("drag", function() {
      d3.select(this).attr("cx", d3.event.x);
      d3.select(this).attr("cy", d3.event.y);
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
  // d3.select("svg")
  svg.transition()
    .attr("class", "hit");
  setTimeout(function(){
    svg.transition()
    .attr("class","");
  },90);
};

var deathBalls = [1,2,3,4,5,6,7,8,9,10];

create(deathBalls);

setInterval(function() {
  updateEnemies();
}, 1000);

setInterval(function() {
  checkCollision(onCollision);
}, 30);

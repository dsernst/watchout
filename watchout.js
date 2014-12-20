/*globals d3*/
// start slingin' some d3 here.

var width = 750,
    height = 500;

var enemySize = 25;
var xmin =  -height/2 + enemySize;
var xmax =  height/2 - enemySize;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");

var update = function () {
  svg.selectAll("circle")
    .filter(".enemy")
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

  update();
};

var drag = d3.behavior.drag()
  .on("drag", function() {
      d3.select(this).attr("cx", d3.event.x);
      d3.select(this).attr("cy", d3.event.y);
    });

svg.append("circle")
  .attr("class", "david")
  .attr("r", 15)
  .call(drag);

var deathBalls = [1,2,3,4,5,6,7,8,9,10];

create(deathBalls);

setInterval(function() {
  update();
}, 1000);

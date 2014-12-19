/*globals d3*/
// start slingin' some d3 here.

var width = 750,
    height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(32," + (height / 2) + ")");

function update(data) {
  var enemies = svg.selectAll("circle")
      .data(data);


  enemies.enter().append("circle")
    .attr("class", "enemy")
    .attr("r", 50);

}

update([1,2,3,4,5]);

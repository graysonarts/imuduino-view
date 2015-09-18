/* jshint browserify: true */
/* global io */
var d3 = require('d3');

var n = 40,
    accel_x_data = [],
    accel_y_data = [],
    accel_z_data = [];

var margin = { top:20, right: 20, bottom:20, left: 40},
    width = 400 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([0, n-1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-32000, 32000])
    .range([height, 0]);

var line = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d) { return y(d); });

var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('defs').append('clipPath')
    .attr('id', 'clip')
 .append('rect')
    .attr('width', width)
    .attr('height', height);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + y(0) + ')')
    .call(d3.svg.axis().scale(x).orient('bottom').tickFormat(''));

svg.append('g')
    .attr('class', 'y axis')
    .call(d3.svg.axis().scale(y).orient('left').tickFormat(''));

var accel_x = svg.append('g')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .datum(accel_x_data)
    .attr('class', 'line')
    .attr('id', 'accel_x')
    .attr('d', line);

var accel_y = svg.append('g')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .datum(accel_y_data)
    .attr('class', 'line')
    .attr('id', 'accel_y')
    .attr('d', line);

var accel_z = svg.append('g')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .datum(accel_z_data)
    .attr('class', 'line')
    .attr('id', 'accel_z')
    .attr('d', line);


function appendData(data, path, value) {
	data.push(value);
	path
	  .attr('d', line);

	if (data.length > n) {
		data.shift();
	}
}

function shift(path) {
		path
		  .attr('transform', null)
		.transition()
		  .duration(100)
		  .ease('linear')
		  .attr('transform', 'translate(' + x(-1) + ',0)');

}

var socket = io.connect();
socket.on('position', function (data) {
	appendData(accel_x_data, accel_x, data.accel_x);
	appendData(accel_y_data, accel_y, data.accel_y);
	appendData(accel_z_data, accel_z, data.accel_z);

	if (accel_x_data.length > n) {
		shift(accel_x);
		shift(accel_y);
		shift(accel_z);
	}
});
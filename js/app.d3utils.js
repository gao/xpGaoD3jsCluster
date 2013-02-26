var app = app || {};


(function($) {
	
	app.DrawD3Chart = function(type,templateName,data,config){
		data = data.data || {};
		var template = "." + templateName;
		if(type == "line"){
			var margin = {top: 10, right: 10, bottom: 20, left: 50},
				width = 900,
				height = 450;
			
			var max = d3.max(data, function(d) { return d.value });
			var min = 0;
							
			var x = d3.time.scale().range([0, width - margin.left * 2]).domain([data[0].date, data[data.length - 1].date]);
			var y = d3.scale.linear().range([height - margin.left * 2, 0]).domain([min, max]);
				
			var xAxis = d3.svg.axis().scale(x).tickSize(-370).tickPadding(10);
			var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-820).tickPadding(10)
				
			var line = d3.svg.line()
				.x(function(d,i) { return x(data[i].date); })
				.y(function(d,i) { return y(data[i].value); });
				
			var svg = d3.select(template).append("svg")
					.datum(data)
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr('class', 'viz')
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
						
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height-80) + ")")
					.call(xAxis);
			
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);
			
				svg.append("path")
					.attr("class", "line")
					.attr("d", line);
						
				for(var i=0 ;i<data.length;i++){
					svg.append("circle")
						.attr("class", "dot")
						.attr("cx", (line.x())(data,i))
						.attr("cy", (line.y())(data,i))
						.attr("r", 3.5);
				}
		}else if(type == "pie"){
			var width = 960,
		    	height = 500,
		    	radius = Math.min(width, height) / 2;
		    	
		    var color = d3.scale.category20();
		    
		    var arc = d3.svg.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);
			
			var pie = d3.layout.pie()
				.sort(null)
				.value(function(d) { return d.value; });
			
			var svg = d3.select(template)
				.append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
		    
			var arcs = svg.selectAll(".arc")
			    .data(pie(data))
			    .enter().append("g")
			    .attr("class", "arc");
		
			arcs.append("path")
			    .attr("d", arc)
			    .style("fill", function(d,i) { return color(i); });
			
			arcs.append("text")
			    .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
			    .attr("dy", ".35em")
			    .attr("text-anchor", "middle")
			    .text(function(d, i) { return d.data.name + ":" + d.data.value; });	

		}else if(type == "clusterChart"){
			var w = 1280,
			    h = 800,
			    node,
			    link,
			    root;
			
			var force = d3.layout.force()
			    .on("tick", tick)
			    .charge(function(d) { return d._children ? -d.size / 100 : -30; })
			    .linkDistance(function(d) { return d.target._children ? 80 : 30; })
			    .size([w, h - 160]);
			
			var vis = d3.select(template).append("svg:svg")
			    .attr("width", w)
			    .attr("height", h);
			
			//d3.json("getChartReport.jso", function(json) {
			  root = data;
			  root.fixed = true;
			  root.x = w / 2;
			  root.y = h / 2 - 80;
			  update();
			//});
			
			function update() {
			  var nodes = flatten(root),
			      links = d3.layout.tree().links(nodes);
			
			  // Restart the force layout.
			  force
			      .nodes(nodes)
			      .links(links)
			      .start();
			
			  // Update the links…
			  link = vis.selectAll("line.link")
			      .data(links, function(d) { return d.target.id; });
			
			  // Enter any new links.
			  link.enter().insert("svg:line", ".node")
			      .attr("class", "link")
			      .attr("x1", function(d) { return d.source.x; })
			      .attr("y1", function(d) { return d.source.y; })
			      .attr("x2", function(d) { return d.target.x; })
			      .attr("y2", function(d) { return d.target.y; });
			
			  // Exit any old links.
			  link.exit().remove();
			
			  // Update the nodes…
			  node = vis.selectAll("circle.node")
			      .data(nodes, function(d) { return d.id; })
			      .style("fill", color);
			
			  node.transition()
			      .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; });
			
			  // Enter any new nodes.
			  node.enter().append("svg:circle")
			      .attr("class", "node")
			      .attr("cx", function(d) { return d.x; })
			      .attr("cy", function(d) { return d.y; })
			      .attr("r", function(d) { return d.children ? 4.5 : Math.sqrt(d.size) / 10; })
			      .style("fill", color)
			      .on("click", click)
			      .call(force.drag);
			
			  // Exit any old nodes.
			  node.exit().remove();
			}
			
			function tick() {
			  link.attr("x1", function(d) { return d.source.x; })
			      .attr("y1", function(d) { return d.source.y; })
			      .attr("x2", function(d) { return d.target.x; })
			      .attr("y2", function(d) { return d.target.y; });
			
			  node.attr("cx", function(d) { return d.x; })
			      .attr("cy", function(d) { return d.y; });
			}
			
			// Color leaf nodes orange, and packages white or blue.
			function color(d) {
			  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
			}
			
			// Toggle children on click.
			function click(d) {
			  if (d.children) {
			    d._children = d.children;
			    d.children = null;
			  } else {
			    d.children = d._children;
			    d._children = null;
			  }
			  update();
			}
			
			// Returns a list of all nodes under the root.
			function flatten(root) {
			  var nodes = [], i = 0;
			
			  function recurse(node) {
			    if (node.children) node.size = node.children.reduce(function(p, v) { return p + recurse(v); }, 0);
			    if (!node.id) node.id = ++i;
			    nodes.push(node);
			    return node.size;
			  }
			
			  root.size = recurse(root);
			  return nodes;
			}
		}
		
	}

})(jQuery);

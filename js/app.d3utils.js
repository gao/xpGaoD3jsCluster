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
			    rx = w / 2,
			    ry = h / 2,
			    m0,
			    rotate = 0;
			
			var radialGradients=[{id:"radialGradientNodes",endColor:"#FCA000",startColor:"#F8F28A",r:8},
							 {id:"radialGradientOrigin",endColor:"#006400",startColor:"#6DA202",r:12}];
			
			var cluster = d3.layout.cluster()
			    .size([360, ry - 120])
			    .sort(function(a, b){return d3.descending(a.value, b.value);});
			
			var svg = d3.select(template).append("div")
			    .style("width", w + "px")
    			.style("height", w + "px");
			
			var vis = svg.append("svg:svg")
			    .attr("width", w)
			    .attr("height", w)
			    .append("svg:g")
			    .attr("transform", "translate(" + rx + "," + ry + ")");
			    
			var defs = vis.append("defs");
		
			var radialGradient = defs.selectAll("radialGradient")
				.data(radialGradients)
			  .enter()
				.append("radialGradient")
				.attr("id",function(d){return d.id})
				.attr("r","70%")
				.attr("cx", "50%")
			    .attr("cy", "50%")
			    .attr("rx", "50%")
			    .attr("ry", "50%");
			
			radialGradient.append("stop")
				.attr("offset","0%")
				.style("stop-color",function(d){return d.startColor})
				.style("stop-opacity","1");
			radialGradient.append("stop")
				.attr("offset","100%")
				.style("stop-color",function(d){return d.endColor})
				.style("stop-opacity","1");

			
			function xs(d) { return (d.depth>0?(d.y-150+(d.value*5)):d.y) * Math.cos((d.x - 90) / 180 * Math.PI); }
		 	function ys(d) { return (d.depth>0?(d.y-150+(d.value*5)):d.y) * Math.sin((d.x - 90) / 180 * Math.PI); }
		 	
			  var nodes = cluster.nodes(data);
			
			  var link = vis.selectAll("g.link")
		          .data(nodes)
		          .enter()
		          .append("svg:g")
		          .attr("class", "link")
		          .append("line")
		          .attr("x1", function(d) { return xs(d); })
		          .attr("y1", function(d) { return ys(d); })
		          .attr("x2", function(d) { return xs(nodes[0]); })
		          .attr("y2", function(d) { return ys(nodes[0]); });
			
			  vis.selectAll(".dot")
				  .data(nodes)
				.enter().append("ellipse")
				  .attr("class", function(d){ return (d.depth==0) ? "origin" : "nodes";})
				  .attr("cx", function(d) { return xs(d); })
				  .attr("cy", function(d) { return ys(d); })
				  .attr("rx", function(d){ return (d.depth==0) ? 12 : 8; })
				  .attr("ry", function(d){ return (d.depth==0) ? 12 : 8; })
				  .attr("style",function(d){return (d.depth==0) ? "fill:url(#radialGradientOrigin)" : "fill:url(#radialGradientNodes)";})
			  
			  var node = vis.selectAll("g.node")
			      .data(nodes)
			    .enter().append("g")
			      .attr("class", "node")
			      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + getNodeTranslate(d) + ")"; })
			    .append("svg:text")
			      .attr("dx", function(d) { return d.x < 180 ? 12 : -18; })
			      .attr("dy", ".31em")
			      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
			      .text(function(d) { return d.name; });
			
			function getNodeTranslate(d){
	        	var translate = (d.depth>0?(d.y-150+(d.value*5)):d.y);
	        	
	        	return translate;
	        }

		}else if(type == "forceChart"){
			var w = 1000,
			    h = 800,
			    node,
			    link,
			    root;
			
			var force = d3.layout.force()
			    .on("tick", tick)
			    .charge(function(d) { return d._children ? -d.value / 10 : -30; })
			    .linkDistance(function(d) {return d.target._children ? 50 : d.target.value*10; })
			    .size([w, h - 160]);
			
			var vis = d3.select(template).append("svg:svg")
			    .attr("width", w)
			    .attr("height", h);
			
			  root = data;
			  root.fixed = true;
			  root.x = w / 2;
			  root.y = h / 2 - 80;
			  update();
			
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
      			  .attr("r", function(d) { return d.children ? 4.5 : 10; });
			
			  // Enter any new nodes.
			  node.enter().append("svg:circle")
			      .attr("class", "node")
			      .attr("cx", function(d) { return d.x; })
			      .attr("cy", function(d) { return d.y; })
			      .attr("r", function(d) { return d.children ? 4.5 : 10; })
			      .style("fill", color)
			      .on("click", click)
			      .call(force.drag);
			
			  node.append("title")
      			  .text(function(d) { return d.name + ": " + d.value; });
      
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

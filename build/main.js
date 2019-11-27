const main = document.querySelector('#main')
      path = '../data/demo/backbone.json'
      t = d3.transition()
        .duration(150)
        .ease(d3.easeLinear);

d3.csv('components.csv')
	.then(function(components){
		newProject(components)
	})
	.catch(function(error){
		console.log(error)
	})

function newProject(components){
	container = document.createElement('div')
	container.setAttribute('class',"container")
	container.innerHTML=components[0]['content']
	main.appendChild(container)
	start = document.querySelector('#start')
	start.onclick=function() {
		chooseData(components)
	}
}

function chooseData(components){
	clear('#main')
    clear('svg')
    navStatus()
    updateNav('back0','')
    goBack0();
    function goBack0() {
        el=document.querySelector('#back0')
        console.log(el)
        el.onclick=function() {
            location.reload()
        }
    }
	container = document.createElement('div')
	container.setAttribute('class',"container")
	container.innerHTML=components[1]['content']
	main.appendChild(container)
	select = document.querySelector('select')
	select.onchange=function() {
        console.log('changed')
		if (select.value == "demo workshop"){
			myreport(components)
			summarize(path, components)
		} else {
			// upload data 
		}
	}

}

function clear(item){
	target = document.querySelector(item)
	target.innerHTML=""
}

function navStatus(){
    nav = document.querySelector('.nav')
    if(nav!=null){
        nav.remove()
    }
    appendElement('body','div','nav')
}

function myreport(components){
	clear('#main')
	container = document.createElement('div')
	container.setAttribute('class',"container")
	main.appendChild(container)
}

function summarize(results, components){
	d3.json(results)
		.then(function(results){
			cluster(components)
			// wordcount(results)
			// avgsent(results)
			// topsent(results)
			// clusterscards(results)

		})
		.catch(function(error){
			console.log(error)
		})
}

function wordcount(results){
	container=document.querySelector('.container')
	wordcount = document.createElement('div')
	wordcount.setAttribute('class','item')
	container.appendChild(wordcount)
	wordcount.innerHTML+="<h1>Word count</h1>"
	wordcount.innerHTML+="<div class='info'></div>"
	wordcount.innerHTML+="<h2>"+ results['nodes'].length +"</h2>"
}

// append something
function appendElement(location,element,class_name,id){
   target = document.querySelector(location)
   el = document.createElement(element)
   if(class_name!=null){
    el.setAttribute('class',class_name)
   }
   if(id!=null){
    el.setAttribute('id',id)
   }
   target.appendChild(el)
}

// prepend something
function prependElement(location,element,class_name,id){
   target = document.querySelector(location)
   el = document.createElement(element)
   if(class_name!=null){
    el.setAttribute('class',class_name)
   }
   if(id!=null){
    el.setAttribute('id',id)
   }
   target.prepend(el)
}

// update nav
function updateNav(id, content) {
nav = document.querySelector('.nav')
nav.innerHTML="<div class='return' id="+id+"><</div>"+content
}

function cluster(components){

// add navigation and tooltip
appendElement('body','div','tooltip','clustertooltip')

svg = document.querySelector('svg')
svg.style.display="block"

updateNav('back1','<h1>Results</h1>')
goBack1();

function goBack1() {
    el=document.querySelector('#back1')
    console.log(el)
    el.onclick=function() {
        console.log('go back')
        chooseData(components)
    }
}


let width = svg.clientWidth/0.8
	height = svg.clientHeight
	color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json(path).then(function(graph) {

let label = {
    'nodes': [],
    'links': []
};

graph.nodes.forEach(function(d, i) {
    label.nodes.push({node: d});
    label.nodes.push({node: d});
    label.links.push({
        source: i * 2,
        target: i * 2 + 1
    });
});

let labelLayout = d3.forceSimulation(label.nodes)
    .force("charge", d3.forceManyBody().strength(-2))
    .force("link", d3.forceLink(label.links).distance(0).strength(2));

let graphLayout = d3.forceSimulation(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(1))
    .force("y", d3.forceY(height / 2).strength(1))
    .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
    .on("tick", ticked);

var adjlist = [];

graph.links.forEach(function(d) {
    adjlist[d.source.index + "-" + d.target.index] = true;
    adjlist[d.target.index + "-" + d.source.index] = true;
});

function neigh(a, b) {
    return a == b || adjlist[a + "-" + b];
}


var svg = d3.select("#vis")
    .attr("viewBox", "0 0 " + width+ " " + height )
    .attr("preserveAspectRatio", "xMidYMid meet");

var container = svg.append("g");

// svg.call(
//     d3.zoom()
//         .scaleExtent([.1, 4])
//         .on("zoom", function() { container.attr("transform", d3.event.transform); })
// );

var link = container.append("g").attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", "0px");

var node = container.append("g").attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("class",function(d){return d.bing_value})
    .attr("fill", function(d,i) { return color(d.weight); })

node
    .on("mouseover", focus)
    .on("click", reveal)
    .on("mouseout", unfocus);

node.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
);

var labelNode = container.append("g").attr("class", "labelNodes")
    .selectAll("text")
    .data(label.nodes)
    .enter()
    .append("text")
    .text(function(d, i) { return i % 2 == 0 ? "" : d.node.id; })
    .style("fill", "#555")
    .style("font-family", "Arial")
    .style("font-size", 12)
    .style("pointer-events", "none"); // to prevent mouseover/drag capture

node
    .on("mouseover", focus)
    .on("mouseout", unfocus);

function ticked() {

    node.call(updateNode);
    link.call(updateLink);

    labelLayout.alphaTarget(0.3).restart();
    labelNode.each(function(d, i) {
        if(i % 2 == 0) {
            d.x = d.node.x;
            d.y = d.node.y;
        } else {
            var b = this.getBBox();

            var diffX = d.x - d.node.x;
            var diffY = d.y - d.node.y;

            var dist = Math.sqrt(diffX * diffX + diffY * diffY);

            var shiftX = b.width * (diffX - dist) / (dist * 2);
            shiftX = Math.max(-b.width, Math.min(0, shiftX));
            var shiftY = 16;
            this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
        }
    });
    labelNode.call(updateNode);

}

function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
}

function focus(d) {
    var index = d3.select(d3.event.target).datum().index;
    node
    .style("opacity", function(o) {
        return neigh(index, o.index) ? 1 : 0.1;
    })
    .transition(t);
    labelNode.attr("display", function(o) {
      return neigh(index, o.node.index) ? "block": "none";
    })
     .transition(t);
    link.style("opacity", function(o) {
        return o.source.index == index || o.target.index == index ? 1 : 0.1;
    })
     .transition(t);
}

function unfocus() {
   labelNode.attr("display", "block").transition(t);
   node.style("opacity", 1) .transition(t);
   link.style("opacity", 1) .transition(t);
}

function getpos(event) {
    var e = window.event;
    x = e.clientX + "px";
    y = e.clientY + "px";
}

function reveal(d){
    tooltip = document.querySelector('#clustertooltip')
    getpos()
    tooltip.style.display="block"
    tooltip.style.left=x
    tooltip.style.top=y
    tooltip.innerHTML='<p><em>Sentiment</em> '+d['bing_value']+"</p>"
    tooltip.innerHTML+='<p><em>Sentiment value</em> '+d['afinn_value'] +"</p>"
    tooltip.innerHTML+='<p><em>Emotion</em> '+d['nrc_value'] + "</p>"
    tooltip.innerHTML+="<close>Return</close>"
    close = tooltip.querySelector('close')
    close.onclick=function() {
        tooltip.style.display="none"
    }
}


function updateLink(link) {
    link.attr("x1", function(d) { return fixna(d.source.x); })
        .attr("y1", function(d) { return fixna(d.source.y); })
        .attr("x2", function(d) { return fixna(d.target.x); })
        .attr("y2", function(d) { return fixna(d.target.y); });
}

function updateNode(node) {
    node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
}

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) graphLayout.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

}); // d3.json
}


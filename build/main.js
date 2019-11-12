var main = document.querySelector('#main')
	

d3.csv('components.csv')
	.then(function(data){
		newProject(data)
	})
	.catch(function(error){
		console.log(error)
	})

function newProject(data){
	container = document.createElement('div')
	container.setAttribute('class',"container")
	container.innerHTML=data[0]['content']
	main.appendChild(container)
	start = document.querySelector('#start')
	start.onclick=function() {
		chooseData(data)
	}
}

function chooseData(data){
	clear('main')
	container = document.createElement('div')
	container.setAttribute('class',"container")
	container.innerHTML=data[1]['content']
	main.appendChild(container)
	submit = document.querySelector('#selectdata')
	select = document.querySelector('select')
	selectdata.onclick=function() {
		if (select.value == "demo workshop"){
			myreport(data)
			summarize('../data/demo/mst.json')
		} else {
			// upload data 
		}
	}

}

function clear(item){
	target = document.querySelector('#'+item)
	target.innerHTML=""
}

function myreport(data){
	clear('main')
	container = document.createElement('div')
	container.setAttribute('class',"container")
	container.innerHTML=data[2]['content']
	main.appendChild(container)
}

function summarize(results){
	d3.json(results)
		.then(function(results){
			wordcount(results)
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


var main = document.querySelector('#main')
	

d3.csv('components.csv')
	.then(function(data){
		newProject(data)
	})
	.catch(function(error){
		// console.log(error)
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
		console.log(select.value)
	}

}

function clear(item){
	target = document.querySelector('#'+item)
	target.innerHTML=""
}

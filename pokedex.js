var colorType = { ghost: '#a870f8', poison: '#e090f8', water: '#6898f7', ice: '#30d8cf', bug: '#a0c888', steel: '#b8b8d0', ground: '#dbba56', rock: '#c8a048',
dark: '#908888', flying: '#ab96f6', fire: '#f89030', grass: '#90e780', fighting: '#f87070', psychic: '#f838a8', fairy: '#ff65d5', electric: '#e0e000', dragon: '#713af0', normal: '#b8b8a8' };
var answer;
var counterType = '';
var sortingCount = 0;
infoLoad("/api/v1/pokemon/?limit=12");
infoLoad("/api/v2/type/?limit=20");

//загрузка данных из api
function infoLoad(src) { 
	var xmlhtt = new XMLHttpRequest();
	xmlhtt.onreadystatechange = function() {
		if (xmlhtt.readyState==4 && xmlhtt.status==200)
		{
			answer = JSON.parse(xmlhtt.responseText);
			console.log(JSON.parse(xmlhtt.responseText));
			if (src=="/api/v2/type/?limit=20"){
				spisok();
			}else if ( src.charAt(src.length-1)=="/" ) {
				sorting();
			}else {
				(src.length < 24)? more(): allPokemon();
			}			
		}
	}
	if(src==null) {
		src='/api/v1/pokemon/?limit=10&offset=778';
		counterType='end';
	}
	xmlhtt.open("GET", 'http://pokeapi.co'+src, true);	
	xmlhtt.send();
}

//формирование option для select
function spisok() {
	document.getElementById('filtr').options[0] = new Option('all Pokemon', "http://pokeapi.co/api/v1/pokemon/?limit=12");
	for (var i = 1; i < answer.results.length+1; i++) {
		if (answer.results[i-1].name == 'shadow' || answer.results[i-1].name == 'unknown') continue;
		document.getElementById('filtr').options[i] = new Option(answer.results[i-1].name, answer.results[i-1].url);
		document.getElementById('filtr').options[i].style.backgroundColor =  colorType[answer.results[i-1].name];
	}
}

//отображение покемонов по фильтру
function sorting() {
	if (counterType.slice(13, counterType.length-1)==answer.id){
		sortingCount += 12;
	}else{
		while(document.getElementsByClassName('pokemon col-xs-6 col-sm-4 col-md-3 col-lg-2').length) {
			document.getElementsByClassName('pokemon col-xs-6 col-sm-4 col-md-3 col-lg-2')[0].remove();
		}
	}	
	for (var p = sortingCount; p < sortingCount+12; p++) {
		if (answer.pokemon[p] == undefined) {
			counterType='end';
			return;	
		}
		var imagePokemon = document.createElement('img');
		var swimmingPokemon = document.createElement('div');
		swimmingPokemon.className = 'swimmingPokemon';
		imagePokemon.src = "http://pokeapi.co/media/img/"+answer.pokemon[p].pokemon.url.slice(33, answer.pokemon[p].pokemon.url.length-1)+".png";
		imagePokemon.className = 'imagePokemon';
		var pokemon = document.createElement('div');
		pokemon.className = 'pokemon col-xs-6 col-sm-4 col-md-3 col-lg-2';
		var divImagePokemon = document.createElement('div');
		divImagePokemon.className = 'divimagePokemon';
		pokemon.id = answer.pokemon[p].pokemon.url.slice(33, answer.pokemon[p].pokemon.url.length-1);
		swimmingPokemon.onclick = function () {infoLoad('/api/v1/pokemon/'+pokemon.id)}
		divImagePokemon.appendChild(imagePokemon);
		divImagePokemon.innerHTML += answer.pokemon[p].pokemon.name.slice(0,1).toUpperCase() + answer.pokemon[p].pokemon.name.slice(1) + '<br>'+'<br>';
		divImagePokemon.innerHTML += "<span class=typePokemon style=background-color:"+colorType[answer.name]+">"+
			answer.name.slice(0, 1).toUpperCase() + answer.name.slice(1)+' '+"</span>";				
		swimmingPokemon.appendChild(divImagePokemon);				
		pokemon.appendChild(swimmingPokemon);
		document.getElementById('container').insertBefore(pokemon, document.getElementById('forClick'));
	}
	counterType = '/api/v2/type/' + answer.id + '/';	
}

//подробная информация о покемоне
function more() {

	document.getElementById('info').innerHTML = '';


	var moreInfoPokemon = document.getElementById('info');
	var imagePokemon = document.createElement('img');
	var buttonClose = document.createElement('button');
	buttonClose.className = 'close';
	buttonClose.setAttribute('data-dismiss', 'modal');
	buttonClose.setAttribute('aria-hidden', 'true');
	buttonClose.innerHTML = 'x';
	moreInfoPokemon.appendChild(buttonClose);
	imagePokemon.src = "http://pokeapi.co/media/img/"+answer.pkdx_id+".png";
	imagePokemon.className = 'imagePokemon';
	moreInfoPokemon.appendChild(imagePokemon);
	moreInfoPokemon.style.border = '2px solid black';
	moreInfoPokemon.style.backgroundColor = '#EDFEFF';
	moreInfoPokemon.innerHTML += '<br>'+answer.name+'<br>';				
	if (answer.types[1] != undefined) {
		moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+'Type:'+"</td><td>"+ answer.types[0].name + ", " + answer.types[1].name+'</td></tr></table>';
	}else {
		moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+'Type:'+"</td><td>"+answer.types[0].name+'</td></tr></table>';
	}
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"Attack:" + "</td><td>" + answer.attack+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"Defense:" + "</td><td>" + answer.defense+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"HP:" +"</td><td>" + answer.hp+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"SP Attack:" +"</td><td>" + answer.sp_atk+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"SP Defense:" +"</td><td>" + answer.sp_def+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"Speed:" +"</td><td>" + answer.speed+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"Weight:" +"</td><td>" + answer.weight+'</td></tr></table>';
	moreInfoPokemon.innerHTML += "<table cellspacing=0 border=1><tr><td>"+"Total moves:" +"</td><td>" + answer.moves.length+'</td></tr></table>';
	$('document').ready(function(){
	    $('#modal').modal();
	});	
}

//отображение всех покемонов
function allPokemon (){
	if (counterType!='' || counterType=="change") {
		while(document.getElementsByClassName('pokemon col-xs-6 col-sm-4 col-md-3 col-lg-2').length) {
			document.getElementsByClassName('pokemon col-xs-6 col-sm-4 col-md-3 col-lg-2')[0].remove();
		}
		counterType = '';
	}
	for (var i = 0; i < 12; i++) {
		var imagePokemon = document.createElement('img');
		imagePokemon.src = "http://pokeapi.co/media/img/"+answer.objects[i].pkdx_id+".png";
		imagePokemon.className = 'imagePokemon';
		var pokemon = document.createElement('div');
		var divImagePokemon = document.createElement('div');
		divImagePokemon.className = 'divimagePokemon';
		var swimmingPokemon = document.createElement('div');
		swimmingPokemon.className = 'swimmingPokemon';
		pokemon.className = 'pokemon col-xs-6 col-sm-4 col-md-3 col-lg-2';
		pokemon.id = answer.objects[i].pkdx_id;
		click.srr = answer.meta.next;
		swimmingPokemon.onclick = function () {infoLoad('/api/v1/pokemon/'+pokemon.id)};
		divImagePokemon.appendChild(imagePokemon);
		divImagePokemon.innerHTML += answer.objects[i].name+'<br>'+'<br>';
		for (var e = 0; e < answer.objects[i].types.length; e++) {
			divImagePokemon.innerHTML += "<span class=typePokemon style=background-color:"+colorType[answer.objects[i].types[e].name]+">"+
			answer.objects[i].types[e].name.slice(0, 1).toUpperCase() + answer.objects[i].types[e].name.slice(1)+' '+"</span>";
			pokemon.typeOfpokemon += answer.objects[i].types[e].name;
		}
		swimmingPokemon.appendChild(divImagePokemon);				
		pokemon.appendChild(swimmingPokemon);
		document.getElementById('container').insertBefore(pokemon, document.getElementById('forClick'));
	}
}		
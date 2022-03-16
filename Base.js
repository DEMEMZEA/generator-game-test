"use strict"
let EN = ExpantaNum
let tab = 1
let format = function(x,precision=game.precision,notation=game.notation){
if(x instanceof ExpantaNum===false) x = new EN(x)
if(notation===1||notation===3) precision-=x.log10().floor().sub(x.log10().floor().div(3).floor().mult(3)).toNumber()
if(x.lt(1e3)) return x.mult(10**precision).floor().div(10**precision).toNumber()
if(notation===0) return `${x.div(EN(10).pow(x.log10().floor())).times(10**precision).floor().div(10**precision).toNumber()}e${x.log10().floor().toNumber()}`
if(notation===1) return `${x.div(EN(10).pow(x.log10().floor().div(3).floor().mult(3))).times(10**precision).floor().div(10**precision).toNumber()}e${x.log10().floor().div(3).floor().mult(3).toNumber()}`
if(notation===2) return `e${x.log10().mult(10**precision).floor().div(10**precision).toNumber()}`
if(notation===3) return `${x.div(EN(10).pow(x.log10().floor().div(3).floor().mult(3))).times(10**precision).floor().div(10**precision).toNumber()}${getstandard(x.log10().floor().div(3).floor())}`
}

function getstandard(x){
	x -= 1
	var illion1 = ["k","mi","bi","tr","qa","qi","sx","sp","oc","no"]
	if (x<10) return illion1[x]
    var illion2 = ["","un","do","tr","qa","qi","sx","sp","oc","no"]
	var illion3 = ["","dc","vg","tg","qg","sg","sg","og","ng"]
	var illion4 = ["","ce","dce","tce","qce","qci","sce","stc","oce","nce"]
    if(x>=1000) return illion4[Math.floor(x/100)]+illion3[Math.floor(x/10)%10]+illion2[x%10]
    return getstandard(Math.floor(x/1000)) + illion4[Math.floor(x/100)]+illion3[Math.floor(x/10)%10]+illion2[x%10]
}

let secret = false

let ENify = function(x){
for(let i in x){
if(x[i] instanceof Object){
if(x[i].hasOwnProperty("array")&&x[i].hasOwnProperty("sign")&&x[i].hasOwnProperty("layer")) x[i] = ExpantaNum(x[i])
else x[i] = ENify(x[i])
}
}
return x
}

let save = function(savename="save"){
localStorage.setItem(savename,btoa(JSON.stringify(game)))
}

let load = function(savename="save"){
let item = localStorage.getItem(savename)
if(item===null) return false
game = ENify(JSON.parse(atob(item)))
for(let i in OG){
if(game.hasOwnProperty(i)===false)game[i] = OG[i]
}
}

let exporty = function() {
copyStringToClipboard(btoa(JSON.stringify(game)));
alert("Save Exported Successfully!")
}

function copyStringToClipboard(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = {
    position: "absolute",
    left: "-9999px"
  };
  document.body.appendChild(el);
  copyToClipboard(el);
  document.body.removeChild(el);
}

function copyToClipboard(el) {
  el = typeof el === "string" ? document.querySelector(el) : el;
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    var editable = el.contentEditable;
    var readOnly = el.readOnly;
    el.contentEditable = true;
    el.readOnly = true;
    var range = document.createRange();
    range.selectNodeContents(el);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el.setSelectionRange(0, 999999);
    el.contentEditable = editable;
    el.readOnly = readOnly;
  } else {
    el.select();
  }
  document.execCommand("copy");
}

let importy = function(){
let string = prompt("Paste in your save (will overwrite your current save)")
if(string=="") return false
let obj = JSON.parse(atob(string))
let ified = ENify(obj)
for(let i in OG){
if(ified.hasOwnProperty(i)===false)ified[i] = OG[i]
}
game = copyObject(ified)
vue.game = game
}

let copyObject = function(x){
if(typeof x!=="object") return x
let object = new x.constructor()
for(let i in x){
    object[i] = copyObject(x[i])
}
return object
}

let game={
//main variables
machines:EN(1),
money:EN(0),
//presitge
prestigePoints:EN(0),
goldenMachines:0,
goldenEssence:EN(0),
//challenge
challenge:0,
completedChallenges:[0,0,0,0,0],
//time
startTime: Date.now(),
lastTick: Date.now(),
machineTime: 0,
intervalTime:20,
//objects
upgrades:{
money:0,
time:0,
},
unlocks:{
prestige:false,
},
//misc
notation:0,
precision:3,
}

let OG = copyObject(game)

load()

let reset = function(){
if(!confirm("Are you SURE you want to reset your game?")) return false
game = copyObject(OG)
game.startTime = game.lastTick = Date.now()
vue.game=game
}

let pluralize = function(x,y="s",z=""){
if((x instanceof ExpantaNum&&x.eq(1))||x===1) return z
return y
}

setInterval(save,1000)

let timePrices = [1e7,1.25e8,2e9,2e10,4e12,1e15,1e19,4e25,3e32,9e40,1e50,2e62,5e75,1e90,1e110,5.31e135,4.2e169,1e200,1.382e243]
let moneyPrices = function(){
return EN(10).pow(EN(10).times(EN(1.06).pow(game.upgrades.money).sub(0.3)))
}

let challenges={
"amount":5,
goals:[1e3,1e10,1e20,30,2000],
maxCompletions:[1,2,3,4,5],
discriptions:["false","22","amogus test","what???? cat???","was that the bite of '87?"]
}

let getCompletionPrice = function(x){
return EN(challenges.goals[x]).pow(1+game.completedChallenges[x])
}
"use strict"

let runtime = function(time=Date.now()-game.lastTick){

game.lastTick = Date.now()
game.machineTime+=time

if(game.machineTime>=(1000-(game.upgrades.time*50))){
game.money = game.money.add(
game.machines.times(2500+250*game.upgrades.money)
.times(goldenEssenceMultiplier(0))
.times(Math.floor(game.machineTime/(1000-(game.upgrades.time*50)))))
game.machineTime%=(1000-(game.upgrades.time*50))
}

game.goldenEssence = game.goldenEssence.add(calculateEssenceGain().times(time/1000))

}

let loop = setInterval(runtime, game.intervalTime);

let buyMachines = function(x){
let price = machinePrice()
if(x===0&&game.money.gte(price)){
game.money = game.money.sub(machinePrice())
game.machines = game.machines.add(1)
}

if(x===1&&game.money.gte(price)){
game.machines = game.machines.add(game.money.div(price).floor())
game.money = game.money.mod(price)
}
}

let buyGolden = function(x){
if(x===0&&game.prestigePoints.gte(ExpantaNum(2).pow(game.goldenMachines))){
game.prestigePoints = game.prestigePoints.sub(ExpantaNum(2).pow(game.goldenMachines))
game.goldenMachines++
}
if(x===1&&game.prestigePoints.gte(ExpantaNum(2).pow(game.goldenMachines))){
let gain = game.prestigePoints.add(ExpantaNum(2).pow(game.goldenMachines)).logBase(2).floor().sub(game.goldenMachines).toNumber()
let loss =  game.prestigePoints.sub(ExpantaNum(2).pow(game.prestigePoints.add(ExpantaNum(2).pow(game.goldenMachines)).logBase(2).floor()).sub(ExpantaNum(2).pow(game.goldenMachines)))
game.goldenMachines+= gain
game.prestigePoints = loss
}
}

let buyUpgrades = function(x){
if(x===0&&game.upgrades.time<20&&game.money.gte(timePrices[game.upgrades.time])){
game.money = game.money.sub(timePrices[game.upgrades.time])
game.upgrades.time++
}
if(x===1&&game.money.gte(moneyPrices())){
game.money = game.money.sub(moneyPrices())
game.upgrades.money++
}
}

let machinePrice = function(){
let price = EN(5e5)
if(game.machines.lt(2**128)) return price
price = price.times(game.machines.div(2**128).logBase(2).add(1)).floor()
return price
}

let calculatePrestigeGain = function(){
let gain = game.money.pow(1/Math.log10(2**128)).div(10).floor()
return gain
}

let calculateEssenceGain = function(){
return ExpantaNum(game.goldenMachines)
.pow(2)
.times(goldenEssenceMultiplier(1))
}

let prestige = function(forced=false){
let gain = calculatePrestigeGain()
if(forced||gain.lt(1)) return false
if(!game.unlocks.prestige)game.unlocks.prestige=true
game.money = EN(0)
game.machineTime=0
game.machines = EN(1)
game.upgrades.money = 0
game.upgrades.time = 0
game.prestigePoints = game.prestigePoints.plus(gain)
}

let goldenEssenceMultiplier = function(x){
if(x===0) return game.goldenEssence.add(1).log10().add(1).log10().add(1).tetr(2)
if(x===1) return game.goldenEssence.add(1).log10().add(1).log10().add(1).log10().add(1).tetr(2)
}

let enterChallenge = function(x){
if(game.challenge===x) return false
prestige(true)
game.challenge = x
}
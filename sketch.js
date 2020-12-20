//Create variables here
var dog,dogImage,happyDog,database,foodS,foodStock;
var fedtime,lastFed,feed,addFood;
var foododj;
var garden,washroom,bedroom;
var gameState,readState;

function preload()
{
  dogImage = loadImage('images/dogImg.png');
  happyDog = loadImage('images/dogImg1.png');
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/WashRoom.png");
  bedroom = loadImage("images/BedRoom.png");
}

function setup() {
  database = firebase.database();
	createCanvas(800, 700);
  
  foodObj = new Food();

  dog = createSprite(400,300,50,50);
  dog.addImage(dogImage);
  dog.scale=0.2

  foodStock = database.ref('Food');
  foodStock.on("value",readStock,showError);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  

  
  //add styles here
  background(46,139,87);
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImage);
  }
  
  drawSprites();
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//Function to write values in DB
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


function showError(){

  console.log("Error in reading the food values.")
}
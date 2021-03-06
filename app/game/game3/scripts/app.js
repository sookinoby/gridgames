'use strict';

(function()
 {

angular
.module('gridGame3App', ['gridGameThree', 'ngAnimate', 'ngCookies','timer','ngDropdowns','gridGameThreeGameData','ngRoute'])
.controller('GameController', function(GameManager, KeyboardService,$scope,gameDataService,$routeParams) {
  this.gameType = 3;
//  console.log("The type is" + this.gameType);
  this.game = GameManager;
  this.gameData = null;
  this.timerToggleButton = false;
  KeyboardService.destroy();
  KeyboardService.init();
    
  // the new Game    
  this.newGame = function() {
  this.game.newGame(this.gameData,$scope.ddSelectSelected.value);
 //   console.log("new");
    this.timedGame = this.timerToggleButton;
    this.game.gameOver=false;
    $scope.$broadcast('timer-reset');  
    $scope.$broadcast('timer-reset-new',"gameCountDown",5);
    this.titleOfStrategy =  $scope.ddSelectSelected.text;
   
  };
    
    
  this.loadGameData = function() {
   var self = this;
   var scope = $scope;
   var promise= gameDataService.getGameData(this.gameType);
   promise.then(function (data)
    {
   //  console.log("test" + data.data.GameData);
     self.gameData  = data.data.GameData;
     
     for(var i=0;i < self.gameData.length; i++)
     {
         var single_data = {
         'text' : self.gameData[i].name,
         'value' : self.gameData[i].sname
         }
         
        
         scope.ddSelectOptions.push(single_data);
     }
     self.newGame();
    });
  }
    
    
  $scope.ddSelectOptions = [];
   $scope.ddSelectSelected = {
         'text' : "Add Merge Bucket A0C1",
         'value' : "A0C1"
   };  
    
   this.timedGame = false;
   $scope.timerRunning = false;
    
   this.startTimer = function (name){
  // console.log("what the heck " + name);
   $scope.$broadcast('timer-start',name);  
   $scope.timerRunning = true;
   };

    $scope.stopTimer = function (){
   
    $scope.$broadcast('timer-stop');
    $scope.timerRunning = false;
    };
    
  
    
    this.countDown = function() {
         var self = this;
      $scope.$on('timer-stopped', function (event, args){
                  
           $scope.$apply(function () {            
             self.game.resetTimer();
             if(args.name == "gameCountDown")
             {
                 self.startTimer("gameTimer");
                   //   console.log('Game Count Down ', args);
             }
            else if(args.name == "gameTimer")
             {
                  if(self.timedGame)
                  {
                      self.game.gameOver=true;
                  }
             //     console.log('Game Timer', args);
             }
          //   console.log('Time stopped ', args);
            //  console.log('Game Timer Has stopped ', args);
           
         
           
           });
       });
     }; 

  this.initialiseCallBack = function() {
    var self = this;
      
   
    KeyboardService.on(function(key) {
      self.game.move(key).then(function() {
       
      });
    });
  }; 
    this.initialiseCallBack(); 
  //  this.countDownTimerStart();
   
 //   this.startTimer("gameCountDown");
    
    this.loadGameData();
    this.countDown();
    
        var self = this;
 $scope.$watch('ddSelectSelected.text', function(newVal, oldVal){
    if(self.gameData != null)
    self.newGame();
  });
});
}
)();
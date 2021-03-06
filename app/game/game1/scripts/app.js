'use strict';
(function() {
angular
.module('gridGame1App', ['gridGame1', 'ngAnimate', 'ngCookies','timer','ngDropdowns','gridGame1Data'])
.controller('gridGame1Controller', function(GridGame1Manager, GridGame1KeyboardService,$scope,GridGame1DataService,$routeParams) {

  if($routeParams.type == 2)
  {
      this.gameType = 2;
  }
   else
   {
       this.gameType = 1;
   }
   
//  console.log("The type is" + this.gameType);
  this.game = GridGame1Manager;
  this.gameData = null;
  this.timerToggleButton = false;
  GridGame1KeyboardService.destroy();
  GridGame1KeyboardService.init();
  this.newGame = function() {
  this.game.newGame(this.gameData,$scope.ddSelectSelected.value);
 //   console.log("new");
    this.timedGame = this.timerToggleButton;
    this.game.gameOver=false;
    $scope.$broadcast('timer-reset');  
    $scope.$broadcast('timer-reset-new',"gameCountDown",5);
    this.titleOfStrategy =  $scope.ddSelectSelected.text;
    this.shortTitleOfStrategy = $scope.ddSelectSelected.value;  
   
  };

 
  this.loadGameData = function() {
   var self = this;
   var scope = $scope;
   var promise= GridGame1DataService.getGameData(this.gameType);
   promise.then(function (data)
    {
     self.initialiseDropDown();
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
   //  self.newGame();
    });
  }
    
    
  $scope.ddSelectOptions = [];

   this.initialiseDropDown = function()
   {
      if( this.gameType == 2)
      {
        $scope.ddSelectSelected = {
       
         'text' : "The Two Minute Challenge",
         'value' : "level1"
        };
           this.timerToggleButton = true;
      }
      if( this.gameType == 1)
      {
        $scope.ddSelectSelected = {
       
         'text' : "The Add 0 Strategy",
         'value' : "A0"
        };
      }
       
    }
    
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
   
    GridGame1KeyboardService.on(function(key) {
      self.game.move(key).then(function() {

      });
    });
  };
    this.initialiseCallBack();
 //  this.countDownTimerStart();
   
 //  this.startTimer("gameCountDown");
    
    this.loadGameData();
    this.countDown();
     var self = this;
 $scope.$watch('ddSelectSelected.text', function(newVal, oldVal){
     console.log("fired" + newVal + " " + oldVal);
    if(self.gameData != null)
    self.newGame();
  });
});
}());

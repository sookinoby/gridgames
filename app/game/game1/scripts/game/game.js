(function() {
'use strict';

angular.module('gridGame1', ['gridGame1Grid', 'gridGame1Keyboard', 'ngCookies','gridGame1Data'])
.service('GridGame1Manager', function($q, $timeout, GridGame1Service, $cookieStore,$log) {

  this.getHighScore = function() {
    return parseInt($cookieStore.get('highScore')) || 0;
  };
  this.delay = 5000;
 // console.log(promise);
  this.positionToInsert = {};
  this.grid = GridGame1Service.grid;
  this.tiles = GridGame1Service.tiles;
  this.gameOver = false;
  this.showNextButton = {};
  this.showSubmitButton = {}
  
  this.showSubmitButton.truthValue = false;
  this.showNextButton.truthValue = false;    
 // this.winningValue = 2048;
  this.stats = true;
    
  this.passButton = function()
  {
      GridGame1Service.passSubmitButton(this.showSubmitButton);
      GridGame1Service.passNextButton(this.showNextButton);
  };
  
  this.passButton();
  
  this.indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};   
 
  this.factContent = [
      {
          'fact': '1',
          'select': false,
          'wrong': false,
          'right': false
      },
      {
          'fact': '-',
          'select': false,
          'wrong':  false,
          'right':  false
      },
      {
          'fact': '-',
          'select': false,
          'wrong': false,
          'right': false

      },
      {
          'fact': '-',
          'select': false,
          'wrong':  false,
          'right':  false

      }
      
  ];
      

  this.rightAnswer = false;
  this.netural = true;
  this.resetTimer = function(){
  this.countdownfinished = true;
  };
    
   this.changeStats = function()  {
     this.stats  = !this.stats; 
   };
    
  this.reinit = function() {
    this.gameOver = false;
    this.win = false;
    this.currentScore = 0;
    this.totalfacts = 0;
    this.counter = 1;
    this.countdownfinished = false;
    this.highScore = this.getHighScore();
    this.keypressed = [];
    this.enterKeyCount = 0;
  };
  
  this.reinit();
 
  this.newGame = function(gameData,nameOfStrategy) { 
    self = this;
    GridGame1Service.deleteCurrentBoard();  
    GridGame1Service.buildDataForGame(gameData,nameOfStrategy);
    GridGame1Service.buildEmptyGameBoard();
      
      $timeout(function() {
          self.positionToInsert =               GridGame1Service.buildStartingPosition();
        console.log('update with timeout fired');
    }, self.delay);  
      
 
    this.netural = true;
    this.showSubmitButton.truthValue = false;
    GridGame1Service.resetFactContent();
    this.factContent = GridGame1Service.getFactContent();
    this.reinit();
  };
    
  this.showNextQuestions = function()
  {
              this.keypressed = [];
              this.enterKeyCount = 0;
              GridGame1Service.resetFactContent();
              this.factContent = GridGame1Service.getFactContent();
              GridGame1Service.deleteCurrentBoard();
              this.positionToInsert =                       
              GridGame1Service.buildStartingPosition(this.positionToInsert);
              this.showNextButton.truthValue = false; 
              this.netural = true;
              this.rightAnswer = false;
      
  }
  
  this.evaluateAnswer = function()
  {
        var points_for_questions = GridGame1Service.checkIfAnswerIsValid(this.keypressed);
          
          if(points_for_questions !=null && points_for_questions > 0)
          {
            this.updateScore(this.currentScore + points_for_questions);  
            this.factContent = GridGame1Service.getFactContent();
            this.rightAnswer = true; 
            this.netural = false;
            this.counter++;
       
          }
           // the answer was wrong
            else{
             this.rightAnswer = false; 
             this.netural = false;
            }
            
            this.totalfacts++;
            this.showSubmitButton.truthValue = false;
            this.showNextButton.truthValue = true;
  }

  /*
   * The game loop
   *
   * Inside here, we'll run every 'interesting'
   * event (interesting events are listed in the Keyboard service)
   * For every event, we'll:
   *  1. look up the appropriate vector
   *  2. find the furthest possible locations for each tile and 
   *     the next tile over
   *  3. find any spots that can be 'merged'
   *    a. if we find a spot that can be merged:
   *      i. remove both tiles
   *      ii. add a new tile with the double value
   *    b. if we don't find a merge:
   *      i. move the original tile
   */
  this.move = function(key) {
    
    var self = this;
    
  //  console.log(key);
    var f = function() {
      if(!self.countdownfinished)  
          return;
       if(self.gameOver)
           return true;
           
      if(self.win) { return false; }
      if(key == "enter")
      {
          if(GridGame1Service.getLineNumber() == 0)
              return;
        
          self.enterKeyCount++;
          if(self.enterKeyCount == 1)
          {
           self.evaluateAnswer();
              
          }
          else if(self.enterKeyCount == 2)
          {
              self.showNextQuestions();
          }
      }
      else {
     if(self.enterKeyCount == 0)
      {
       
      // checking for dupilcate key.
       if(GridGame1Service.checkIfDuplicate(key) == -1 && GridGame1Service.checkIfKeyPressAllowed(key) ) 
       {
        self.showSubmitButton.truthValue = true;
        
      
       
      GridGame1Service.selectTitleForProcessing(key);
     // var result = GridGame1Service.checkIfAnswerIsValid(key);
      self.factContent = GridGame1Service.getFactContent();    
   /*   if(result == true){
         self.updateScore(self.currentScore + 1);
         self.factContent = GridGame1Service.getFactContent();
         self.rightAnswer = true; 
         GridGame1Service.deleteCurrentBoard();
         GridGame1Service.buildStartingPosition();
         self.counter++;     
      }
      else {
           self.factContent = GridGame1Service.getFactContent();
           self.rightAnswer = false;
      } */
      
    //  $log.log(self.counter);
    //  if(self.counter > 4)
     //   self.gameOver = true;
       }
       }
      }
    };
    return $q.when(f());
  };
  this.updateScore = function(newScore) {
    this.currentScore = newScore;
    if(this.currentScore > this.getHighScore()) {
      this.highScore = newScore;
      $cookieStore.put('highScore', newScore);
    }
  };

});
}());

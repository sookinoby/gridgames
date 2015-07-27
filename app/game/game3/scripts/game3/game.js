'use strict';

angular.module('gridGameThree', ['gridGameThreeGrid', 'gridGameThreeKeyboard', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, KeyboardService, $cookieStore) {

  this.getHighScore = function() {
    return parseInt($cookieStore.get('highScore')) || 0;
  };
  this.delay = 5000;
    
  this.grid = GridService.grid;
  this.tiles = GridService.tiles;
    
  this.storeAnswer = GridService.storeAnswer;
  //this.winningValue = 2048;
  this.stats = true;
  this.showNextButton = {};
  this.showSubmitButton = {};
  this.showSubmitButton.truthValue = false;
  this.showNextButton.truthValue = false;    
  this.questionToDisplay = {};
  this.enterCount = 0;
  this.totalfacts = 0;
  this.rightAnswer = false;
  this.netural  = true;
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
    
  this.resetTimer = function(){
  this.countdownfinished = true;
  };
    
    this.changeStats = function()  {
     this.stats  = !this.stats; 
   };
/*    
  this.isAnswerSelected = function()
  {
      console.log(GridService.isAnswerSelected());
      return GridService.isAnswerSelected();
  };
*/    
  this.passButton = function()
  {
      GridService.toShowSubmitButton(this.showSubmitButton);
      GridService.toShowNextButton(this.showNextButton);
  };
  
  this.passButton();
    
  this.evaluateAnswer = function()
  {
     var score = GridService.evaluateAnswer();
     this.showSubmitButton.truthValue = false;
      this.showNextButton.truthValue = true;  
      if(score > 0)
      {
        this.rightAnswer = true;  
        this.netural  = false;
//     GridService.deleteCurrentBoard();
  //   GridService.buildStartingPosition();
     this.updateScore(score);
      }
      else
      {   this.netural  = false;
          this.rightAnswer = false;
      }
    // console.log("test");
  }
  
  this.showNextQuestions = function()
  {
    
      this.totalfacts =  this.totalfacts + 1;
      GridService.deleteCurrentBoard();
      GridService.buildStartingPosition();
      GridService.resetFactContent();
      this.factContent = GridService.getFactContent();
      this.rightAnswer = false;
      this.netural  = true;
      this.showNextButton.truthValue = false;
      this.showSubmitButton.truthValue = false;
  }
    
      
    
  this.reinit = function() {
    this.gameOver = false;
    this.win = false;
    this.currentScore = 0;
    this.totalfacts = 0;
    this.highScore = this.getHighScore();
    this.countdownfinished = false;
    this.showSubmitButton.truthValue = false;
    this.enterCount = 0;
    this.rightAnswer = false;
    this.netural  = true;
   
  };
  this.reinit();

  this.newGame = function(gameData,nameOfStrategy) {
    
 
    this.questionToDisplay = {};
    GridService.resetFactContent();
    GridService.deleteCurrentBoard();
    GridService.toShowQuestion(this.questionToDisplay);
    GridService.buildDataForGame(gameData,nameOfStrategy);
    GridService.buildEmptyGameBoard();
    $timeout(function() {
     GridService.buildStartingPosition();
        console.log('update with timeout fired');
    }, self.delay);     
    this.factContent =  GridService.getFactContent();
    this.reinit();
  };
    
    

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
     
 /*     if(!self.countdownfinished)  
          return;
       if(self.gameOver)
           return true;
           */
          
      if(self.win) { return false; }
      if(key == "enter")
      {
        self.enterCount++;
        if(GridService.isAnswerSelected() == true)
        {
              if(self.enterCount == 1)
              {
             self.evaluateAnswer();
              }
             if(self.enterCount == 2)
             {
           // console.log("counter");
             self.showNextQuestions();
           
                 self.enterCount = 0; 
             }
            
        } else {
            self.enterCount = 0;
        }
        
      }

    };
    return $q.when(f());
  };

  this.updateScore = function(newScore) {
     // console.log(newScore + "ff");
    this.currentScore = this.currentScore + newScore;
    if(this.currentScore > this.getHighScore()) {
      this.highScore = this.currentScore + newScore;
      $cookieStore.put('highScore', newScore);
    }
  };

});

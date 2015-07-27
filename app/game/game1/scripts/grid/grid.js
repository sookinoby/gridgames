(function() {
'use strict';

angular.module('gridGame1Grid', [])
.factory('GridGameGenerateUniqueId', function() {
  // http://stackoverflow.com/questions/12223529/create-globally-unique-id-in-javascript
  var generateUid = function (separator) {
    var delim = separator || '-';
    function S4() {
      return (((1 + Math.random()) * 0x10000) || 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
  };
  return {
    next: function() { return generateUid(); }
  };
})
.factory('GridGame1TileModel', function(GridGameGenerateUniqueId) {
  var Tile = function(pos, val,answer,question) {
    this.x      = pos.x;
    this.y      = pos.y;
    this.value  = val;
    this.answer = answer;
    this.question = question;
    this.id = GridGameGenerateUniqueId.next();
    this.merged = null;
    this.changeColor = false;
    this.selected = false;
    this.default = true;
      
  };

  Tile.prototype.savePosition = function() {
    this.originalX = this.x;
    this.originalY = this.y;
  };
    
   Tile.prototype.setChangeColor = function() {
    this.default = false;
    this.changeColor = true;
  };   
    
  Tile.prototype.resetChangeColor = function() {
    this.default = true;  
    this.changeColor = false;
  }; 
    
  Tile.prototype.setSelected = function() {
    this.selected = true;
  };   

   Tile.prototype.getSelected = function() {
    return this.selected;
  };   
    
  Tile.prototype.resetSelected = function() {
    this.selected = false;
  }; 
        
    

  Tile.prototype.reset = function() {
    this.merged = null;
  };

  Tile.prototype.setMergedBy = function(arr) {
    var self = this;
    arr.forEach(function(tile) {
      tile.merged = true;
      tile.updatePosition(self.getPosition());
    });
  };

  Tile.prototype.updateValue = function(newVal) {
    this.value = newVal;
  };

  Tile.prototype.updatePosition = function(newPosition) {
    this.x = newPosition.x;
    this.y = newPosition.y;
  };

  Tile.prototype.getPosition = function() {
    return {
      x: this.x,
      y: this.y
    };
  };

  return Tile;
})
.provider('GridGame1Service', function() {
  this.size = 4; // Default size
  
//  this.startingTiles = 1; // default starting tiles
  this.currentQuestionCells ;
  this.selectedAnswer = [];
  this.showSubmitButton = null;
  this.showNextButton = null;
  this.linenumber = 0;
  this.factContent;
  this.currentAnswersCells = [];
      
  this.setSize = function(sz) {
    this.size = sz ? sz : 0;
  };


  var service = this;

  this.$get = function(GridGame1TileModel) {
    this.grid   = [];
    this.tiles  = [];
    this.gameData = [];
    this.nameOfStrategy = null; 
    this.keysPressed = [];
    // Private things
    var vectors = {
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 },
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 }
    };
      
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
    
    this.buildDataForGame = function(gameData,nameOfStrategy) {
        this.gameData = gameData;
        this.nameOfStrategy = nameOfStrategy;
    
    };
      
    // Build game board
    this.buildEmptyGameBoard = function() {
      var self = this;
      // Initialize our grid
      for (var x = 0; x < service.size * service.size; x++) {
        this.grid[x] = null;
      }

      this.forEach(function(x,y) {
        self.setCellAt({x:x,y:y}, null);
      });
    };

    /*
     * Prepare for traversal
    
    this.prepareTiles = function() {
      this.forEach(function(x,y,tile) {
        if (tile) {
          tile.savePosition();
          tile.reset();
        }
      });
    }; */

    this.cleanupCells = function() {
      var self = this;
      this.forEach(function(x, y, tile) {
        if (tile && tile.merged) {
          self.removeTile(tile);
        }
      });
    };
      
    this.setAnswerTile = function(tile) {
      this.correctAnswerTile.push(tile);    
    }
    
    this.getAnswerTile = function() {
        return this.correctAnswerTile;
    }
    
    this.resetAnswerTile = function(tile) {
        this.correctAnswerTile = null;
    }

    /*
     * Due to the fact we calculate the next positions
     * in order, we need to specify the order in which
     * we calculate the next positions
    
    this.traversalDirections = function(key) {
      var vector = vectors[key];
      var positions = {x: [], y: []};
      for (var x = 0; x < this.size; x++) {
        positions.x.push(x);
        positions.y.push(x);
      }

      if (vector.x > 0) {
        positions.x = positions.x.reverse();
      }
      if (vector.y > 0) {
        positions.y = positions.y.reverse();
      }

      return positions;
    }; */


    /*
     * Calculate the next position for a tile
    
    this.calculateNextPosition = function(cell, key) {
      var vector = vectors[key];
      var previous;

      do {
        previous = cell;
        cell = {
          x: previous.x + vector.x,
          y: previous.y + vector.y
        };
      } while (this.withinGrid(cell) && this.cellAvailable(cell));

      return {
        newPosition: previous,
        next: this.getCellAt(cell)
      };
    }; */

    this.withinGrid = function(cell) {
      return cell.x >= 0 && cell.x < this.size &&
              cell.y >= 0 && cell.y < this.size;
    };

/*    this.cellAvailable = function(cell) {
      if (this.withinGrid(cell)) {
        return !this.getCellAt(cell);
      } else {
        return null;
      }
    };*/

    /*
     * Build the initial starting position
     * with randomly placed tiles
     */
    this._getRandom = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;    
    }; 
      
     this.getOptions = function(answer,optionsArrayList) {
       var makeOption = [];
        for(var x=0; x < answer.length; x++)
        {
            makeOption.push(answer[x]);
           
        }
       
       for(var x=0; x < 4 - answer.length; x++)
       {
            var ran = this._getRandom(0,(optionsArrayList.length-1));
            var op = optionsArrayList.splice(ran,1).toString();
           // console.log(op);
            makeOption.push(op);
       }
       return makeOption; 
     };
      
    this.resetFactContent = function(){
     this.linenumber = 0;
     this.factContent = [
      {
          'fact': '-',
          'select': false,
          'wrong': false,
          'right': false,
          'isAnswer': false
      },
      {
          'fact': '-',
          'select': false,
          'wrong':  false,
          'right':  false,
          'isAnswer': false
      },
      {
          'fact': '-',
          'select': false,
          'wrong': false,
          'right': false,
          'isAnswer': false

      },
      {
          'fact': '-',
          'select': false,
          'wrong':  false,
          'right':  false,
          'isAnswer': false

      }
      
  ];    
        
    }
    
    this.buildStartingPosition = function(placeToInsert) {
      
    var sname = this.nameOfStrategy;
    var statergy_to_select = null;
    if(sname != null)
    {
        for(var i=0; i < this.gameData.length; i++)
        {
            if(this.gameData[i].sname == sname)
                statergy_to_select = this.gameData[i];
            
        }
        // no matching name found
        if(statergy_to_select== null)
            statergy_to_select = this.gameData[0];
    }
    else {
       statergy_to_select = this.gameData[0];  
    }
        //  console.log(statergy_to_select);
        
    var ran = this._getRandom(0,statergy_to_select.questions.length-1);
    // hold the question    
    var q = statergy_to_select.questions[ran].q;
     // hold the arraylist of answers
    var a = statergy_to_select.questions[ran].a;
    // arraylist of options
    var optionsArrayList = statergy_to_select.questions[ran].o;
     // list of correctAnswer
     this.correctAnswerTile = [];
    // the slice function will create a copy of arraylist, so we wont destory arraylist
   var answersAndOptions = this.getOptions(a.slice(),optionsArrayList.slice());
        // console.log(makeOption);
    // inserts the question at random place    
    var tile =   this.randomlyInsertNewQuestionTile(q,placeToInsert);
        
        
    this.points_for_questions = 0;    
   
   // this.factContent = q + a;
    var neighbhourCellsAvailable = this.findRelativeAvailableCells(tile);
   
    this.insertTileAtAdjacentPosition(neighbhourCellsAvailable,answersAndOptions,a.length);    
    this.currentQuestionCells = tile;
    this.currentAnswersCells = neighbhourCellsAvailable;  
   // console.log(neighbhourCellsAvailable);
    return neighbhourCellsAvailable[0];
    };
      
    this.deleteCurrentBoard = function() {
   
    if( this.currentAnswersCells != undefined && this.currentQuestionCells != null)
    {
    this.showSubmitButton.truthValue = false;
    this.showNextButton.truthValue = false; 
    this.keysPressed = [];
    this.removeTile(this.currentQuestionCells);
    for(var x=0; x < this.currentAnswersCells.length; x++)
        {

        this.removeTile(this.currentAnswersCells[x]);
        }
        this.currentAnswersCells = [];
        this.currentQuestionCells = null;
        this.resetAnswerTile();
    }
    };

    /*
     * Get all the available tiles
     */
    this.availableCells = function() {
      var cells = [],
          self = this;

      this.forEach(function(x,y) {
        var foundTile = self.getCellAt({x:x, y:y});
        if (!foundTile) {
          cells.push({x:x,y:y});
        }
      });

      return cells;
    };

    /*
     * Check to see if there are any matches available
     
    this.tileMatchesAvailable = function() {
      var totalSize = service.size * service.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        var tile = this.tiles[i];

        if (tile) {
          // Check all vectors
          for (var vectorName in vectors) {
            var vector = vectors[vectorName];
            var cell = { x: pos.x + vector.x, y: pos.y + vector.y };
            var other = this.getCellAt(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
      return false;
    };*/

    /*
     * Get a cell at a position
     */
    this.getCellAt = function(pos) {
      if (this.withinGrid(pos)) {
        var x = this._coordinatesToPosition(pos);
        return this.tiles[x];
      } else {
        return null;
      }
    };

    /*
     * Set a cell at position
     */
    this.setCellAt = function(pos, tile) {
      if (this.withinGrid(pos)) {
        var xPos = this._coordinatesToPosition(pos);
        this.tiles[xPos] = tile;
      }
    };

      /*
    this.moveTile = function(tile, newPosition) {
      var oldPos = {
        x: tile.x,
        y: tile.y
      };

      this.setCellAt(oldPos, null);
      this.setCellAt(newPosition, tile);
       
      tile.updatePosition(newPosition);
    }; */

    /*
     * Run a callback for every cell
     * either on the grid or tiles
     */
    this.forEach = function(cb) {
      var totalSize = service.size * service.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        cb(pos.x, pos.y, this.tiles[i]);
      }
    };

    /*
     * Helper to convert x to x,y
     */
    this._positionToCoordinates = function(i) {
      var x = i % service.size,
          y = (i - x) / service.size;
      return {
        x: x,
        y: y
      };
    };

    /*
     * Helper to convert coordinates to position
     */
    this._coordinatesToPosition = function(pos) {
      return (pos.y * service.size) + pos.x;
    };

    /*
     * Insert a new tile
     */
    this.insertTile = function(tile) {
      var pos = this._coordinatesToPosition(tile);
      this.tiles[pos] = tile;
    };

    this.newTile = function(pos, value,answer,question) {
      return new GridGame1TileModel(pos, value,answer,question);
    };

    /*
     * Remove a tile
     */
    this.removeTile = function(pos) {
      pos = this._coordinatesToPosition(pos);
      this.tiles[pos] = null;
     // delete this.tiles[pos];
    };

    /*
     * Same position
    =
    this.samePositions = function(a, b) {
      return a.x === b.x && a.y === b.y;
    }; */

    /*
     * Randomly insert a new tile
     */
    this.randomlyInsertNewQuestionTile = function(question,placeToInsert) {
        var cell = null;
      //   console.log("Testing 1");
        if(placeToInsert == null || placeToInsert == {} )
        {
        
         cell =   this.randomAvailableCell(); // Sooki edited it the for not making it random  {x:1,y:2},
        //    console.log(cell);
        }
        else {
        //  console.log("Testing 2");
          cell = placeToInsert;
        //     console.log(cell);
        }
          var tile = this.newTile(cell, question,false,true);
          this.insertTile(tile);
          return tile;
    };
      
    
      
    /* code edited by suresh */
    this.shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
    };
      
    this.getFactContent = function() {
      return this.factContent;
    };
      
      
      
     this.findRelativeAvailableCells = function(tile) {
      var x = tile.x;
	  var y = tile.y;
	  var avaiableNeighbhourCells = []
	  if( x +1 < service.size)
	  {
	       avaiableNeighbhourCells.push({x:x+1,y:y});
	  }
	  if( x - 1 >= 0)
	  {
	       avaiableNeighbhourCells.push({x:x-1,y:y});
	  }
	  if( y - 1 >= 0)
	  {
	       avaiableNeighbhourCells.push({x:x,y:y-1});
	  }
	  if( y + 1 < service.size)
	  {
	       avaiableNeighbhourCells.push({x:x,y:y+1});
	  }
	  return avaiableNeighbhourCells;
     
    };    
      
   
      
  
     this.insertTileAtAdjacentPosition = function(avaiableNeighbhourCells,answerAndOptions,no_of_answers) {
     avaiableNeighbhourCells = this.shuffle(avaiableNeighbhourCells);
       
      for (var x = 0; x < avaiableNeighbhourCells.length; x++) {
        var cell =  avaiableNeighbhourCells[x];
        var tile; 
        if( x < no_of_answers )
        {
        tile = this.newTile(cell, answerAndOptions[x],true,false);
        }
        else {
        tile = this.newTile(cell, answerAndOptions[x],false,false);
        }
        // resetting change color
        // reset selected color
        tile.resetChangeColor();
        tile.resetSelected();
        if(tile.answer)
        {
            this.setAnswerTile(tile)
        }
        this.insertTile(tile);
      }
        

    };
    
      this.checkIfDuplicate = function(key)
      {
          
          if(this.keysPressed.indexOf(key) == -1)
          {
             
              this.keysPressed.push(key);
              return -1;
          }
          return 1;
      }
      
      this.getCorrespondingArrowKey = function(tileDetail)
      {
          var UP    = 'up',
            RIGHT = 'right',
            DOWN  = 'down',
            LEFT  = 'left';
          var tile = service.currentQuestionCells;
          var ques_x = tile.x;
          var ques_y = tile.y;
        
          var cal_x = tileDetail.x;
          var cal_y = tileDetail.y;
          
          var key;
          if(ques_x - cal_x == 1)
          {
              key = LEFT; 
            //  console.log(LEFT);
          }
          if(ques_x - cal_x == -1)
          {
              key = RIGHT; 
            //  console.log(RIGHT);
          }
          if(ques_y - cal_y == 1)
          {
              key = UP;
            //  console.log(UP);
          }
          if(ques_y - cal_y == -1)
          {
              key = DOWN;
              //console.log(DOWN);
          }
          if(service.checkIfDuplicate(key) == -1)
              service.selectedAnswer.push(key);
      }
      
    
      
      this.selectTitleForProcessing = function(key,tileDetail){  
          
          if(service.showNextButton.truthValue)
              return;
          
          var tile = service.currentQuestionCells;
          var ques_x = tile.x;
        var ques_y = tile.y;
          
          if(tileDetail !== undefined)
          {
          if(ques_x == tileDetail.x && ques_y == tileDetail.y)
              return;
          }
          
          var guessed_answer;
          if(tileDetail !== undefined)
          {
            var cal_x = tileDetail.x;
            var cal_y = tileDetail.y;
           
            guessed_answer = tileDetail;
            service.getCorrespondingArrowKey(tileDetail);
              
              
          
            //var guessed_answer = this.getCellAt({x:cal_x,y:cal_y}); 
         
           }
           else {
            var vector = vectors[key];
           
            
            var cal_x = tile.x + vector.x;
            var cal_y = tile.y + vector.y;
            guessed_answer = service.getCellAt({x:cal_x,y:cal_y}); 
           }
            if(guessed_answer == null)
            {
              return false;
            
            }
            
           
           if(guessed_answer.getSelected())
                 return false;
            if(guessed_answer.value == service.currentQuestionCells.value)
                 return false;

            guessed_answer.setSelected();
            service.showSubmitButton.truthValue = true;
          
            if(this.linenumber > 3)
                return false
          
            service.factContent[service.linenumber].fact = tile.value + guessed_answer.value ;
            service.factContent[service.linenumber].select = true;
            service.factContent[service.linenumber].isAnswer = guessed_answer.answer;
          //  console.log(this.factContent);
            service.linenumber++;
          
            return true;
    }
      
  /*    this.checkIfAnswerIsValid = function(key) {
      var vector = vectors[key];
      var tile = this.currentQuestionCells;
      var ques_x = tile.x;
      var ques_y = tile.y;
      var cal_x = tile.x + vector.x;
      var cal_y = tile.y + vector.y;
      var guessed_answer = this.getCellAt({x:cal_x,y:cal_y}); 
       if(guessed_answer == null)
       {
              return false;
       }
    //  console.log(guessed_answer)
      var result = guessed_answer.answer;
      if(result == false)
      {
          guessed_answer.setChangeColor();
          var right_answer = this.getAnswerTile();
          right_answer.setChangeColor();
                         
      }
      else if(result)
      {
          guessed_answer.setChangeColor();
      }      
          
      var positions = {x: [], y: []};
      for (var x = 0; x < this.size; x++) {
        positions.x.push(x);
        positions.y.push(x);
      }



      return result;
    }; */
      
     this.factContentColorChange = function(){
         for(var i = 0; i <4; i++)
         {
          if(this.factContent[i].select == true)
          {
              if(this.factContent[i].isAnswer == true)
              {
                  this.factContent[i].right = true;
              }
              else {
                  this.factContent[i].wrong = true;
              }
                 
          }
         }
     }  
    
      this.checkIfKeyPressAllowed = function(key) {
      
      var vector = vectors[key];
      var tile = this.currentQuestionCells;     
      var ques_x = tile.x;
      var ques_y = tile.y;
      var cal_x = tile.x + vector.x;
      var cal_y = tile.y + vector.y;
      var guessed_answer = this.getCellAt({x:cal_x,y:cal_y}); 
     
    //  console.log(guessed_answer)
       if(guessed_answer == null)
       {
           return false;
       }
          return true;
          
      }
     
    this.checkIfAnswerIsValid = function() {
        
    if(this.keysPressed.length == 0)
    {
         var right_answers = this.getAnswerTile();
         // console.log(right_answers);   
          for (var i = 0; i < right_answers.length; i++) {
            //console.log(right_answers);   
           var right_answer = right_answers[i];
           right_answer.setChangeColor();
          }
    }
        
      for (var i = 0; i < this.keysPressed.length; i++) {
     
     
      var vector = vectors[this.keysPressed[i]];
    
      var tile = this.currentQuestionCells;
      var ques_x = tile.x;
      var ques_y = tile.y;
      var cal_x = tile.x + vector.x;
      var cal_y = tile.y + vector.y;
      var guessed_answer = this.getCellAt({x:cal_x,y:cal_y}); 
     
    //  console.log(guessed_answer)
       if(guessed_answer == null)
       {
           continue;
       }
      var result = guessed_answer.answer;
      if(result == false)
      {
         
         
          guessed_answer.setChangeColor();
          var right_answers = this.getAnswerTile();
          for (var j = 0; j < right_answers.length; j++) {
           var right_answer = right_answers[j];
           right_answer.setChangeColor();
          }
       
                     
      }
      else if(result)
      {
            this.points_for_questions =  this.points_for_questions + 1;
           // console.log("correct answer");
            guessed_answer.resetSelected();
            guessed_answer.setChangeColor();
      }
     
          
     }
      this.factContentColorChange(); 
      return this.points_for_questions;
    }; 
      
    this.passSubmitButton = function(submitButton) {
      this.showSubmitButton = submitButton;
    };
      
    this.passNextButton = function(nextButton) {
      this.showNextButton = nextButton;
    };  
    
    this.getLineNumber = function() {
        return service.linenumber;
    }
      /* finished code edited by suresh */

    /*
     * Get a randomly available cell from all the
     * currently available cells
     */
    this.randomAvailableCell = function() {
      var cells = this.availableCells();
      if (cells.length > 0) {
        return cells[Math.floor(Math.random() * cells.length)];
      }
    };

    /*
     * Check to see there are still cells available
     */
    this.anyCellsAvailable = function() {
      return this.availableCells().length > 0;
    };
      


    return this;
  };
});
}());
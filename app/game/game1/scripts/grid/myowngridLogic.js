/* code edited by suresh */      
      
     this.findSurrondingPosition = function() {
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

    this.buildStartingPositionIteration = function() {
    var tile = this.randomlyInsertNewTile();
    this.findRelativeAvailableCells(tile); 
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
	
	this.randomlyInsertNewTile = function() {
      var cell = this.randomAvailableCell(),
          tile = this.newTile(cell, 2);
      this.insertTile(tile);
	  return tile;
    };
	
	
	
/* code edited by suresh */      
      inserTileAtPosition
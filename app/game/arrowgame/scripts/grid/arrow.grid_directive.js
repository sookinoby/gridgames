(function() {
'use strict';

angular.module('gridGame1Grid')
.directive('grid1', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/arrowgame/scripts/grid/arrow.grid.html',
    link: function(scope) {
      // Cell generation
      //  console.log(scope)
      scope.grid = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
    
    }
  };
});
}());
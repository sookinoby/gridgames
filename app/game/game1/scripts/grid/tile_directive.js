(function() {
'use strict';
angular.module('gridGame1Grid')
.directive('tile1', function(GridGame1Service) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/game1/scripts/grid/tile.html',
      link: function(scope) {
      // Cell generation
      scope.selectTitleForProcessing = GridGame1Service.selectTitleForProcessing;
    }
  };
});
}());
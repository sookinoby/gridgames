(function() {
'use strict';
angular.module('arrowGameGrid')
.directive('tile1', function(GridGame1Service) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/arrowgame/scripts/grid/arrow.tile.html',
      link: function(scope) {
      // Cell generation
      scope.selectTitleForProcessing = GridGame1Service.selectTitleForProcessing;
    }
  };
});
}());
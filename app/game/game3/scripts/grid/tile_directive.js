'use strict';

angular.module('gridGameThreeGrid')
.directive('tile', function(GridService) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/game3/scripts/grid/tile.html',
    link: function(scope) {
      // Cell generation
      scope.storeAnswer = GridService.storeAnswer;
    }
  };
});
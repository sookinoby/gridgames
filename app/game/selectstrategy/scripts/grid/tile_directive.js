'use strict';

angular.module('gridGameThreeGrid')
.directive('tile', function(GridService) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/selectstrategy/scripts/grid/tile.html',
    link: function(scope) {
      // Cell generation
      scope.storeAnswer = GridService.storeAnswer;
    }
  };
});
'use strict';

angular.module('gridGameThreeGrid')
.directive('tile', function(SelectStrategyGridService) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/selectstrategy/scripts/grid/selectstrategy.tile.html',
    link: function(scope) {
      // Cell generation
      scope.storeAnswer = SelectStrategyGridService.storeAnswer;
    }
  };
});
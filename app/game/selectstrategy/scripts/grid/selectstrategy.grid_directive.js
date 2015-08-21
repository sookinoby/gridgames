(function(){
'use strict';

angular.module('selectStrategyGrid')
.directive('gridSelectStrategy', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/selectstrategy/scripts/grid/selectstrategy.grid.html',
    link: function(scope) {
      // Cell generation
      scope.grid = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
    }
  };
});
})();
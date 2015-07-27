'use strict';

angular.module('gridGameThreeGrid')
.directive('grid', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'game/game3/scripts/grid/grid.html',
    link: function(scope) {
      // Cell generation
      scope.grid = scope.ngModel.grid;
      scope.tiles = scope.ngModel.tiles;
    }
  };
});
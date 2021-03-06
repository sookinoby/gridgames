(function() {
  var gridGame1DataService = function ($http,$q) {
   
      this.getGameData = function(gameDataFile)
      {
        
           var deferred = $q.defer();
           var gameDataFile = "gamedata" +gameDataFile + ".json";
            $http.get('game/game1/scripts/game/' + gameDataFile).then(function (data)
            {
                deferred.resolve(data);                            
            });
          return deferred.promise;
      }
  };
angular.module('gridGame1Data',[]).service('GridGame1DataService',gridGame1DataService);

}());
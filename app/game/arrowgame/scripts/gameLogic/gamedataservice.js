(function() {
  var arrowGameDataService = function ($http,$q) {
   
      this.getGameData = function(gameDataFile)
      {
        
           var deferred = $q.defer();
           var gameDataFile = "gamedata" +gameDataFile + ".json";
            $http.get('game/arrowgame/scripts/gameLogic/' + gameDataFile).then(function (data)
            {
                deferred.resolve(data);                            
            });
          return deferred.promise;
      }
  };
angular.module('arrowGameData',[]).service('arrowGameDataService',arrowGameDataService);

}());
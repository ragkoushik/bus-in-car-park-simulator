var app = angular.module("busInCarParkSimulator", []); 

app.factory("dataService", function($http) { 
    return {
        getData: function () {
            return $http.get("fetch-simulator-config").then(function (response) {
               return response.data;
            });
        }
    };
});

app.controller("busCtrl", function($scope, dataService, $http) {
    $scope.loading = true;
    dataService.getData().then(function(data) {
        $scope.config   = data.config;
        $scope.carPark  = [];
        var x,y;
        for (var row = 0; row < $scope.config.carPark.lengthX; row++) {
            $scope.carPark[row] = [];
            x = 0;
            y = $scope.config.carPark.lengthY - 1 - row ;
            for (var col = 0; col < $scope.config.carPark.lengthY; col++) {
                $scope.carPark[row].splice(col,0,{x:x, y:y });
                x++;
            }
        }
        $scope.loading = false;
    });
    
    $scope.controlBus = function (cmd){
        if (cmd !== undefined ){
            $scope.executing = true;
            var url = {
                        method: 'POST',
                        url: '/control-bus',
                        headers: {
                          "content-type": "application/json",
                        },
                        data: { 
                                cmd : cmd
                            }
                        };

            $http(url).then(
                function(response) {
                    $scope.executing = false;
                    $scope.message = response.data.message;
                    $scope.success = response.data.success;
                    $scope.currentPos = response.data.currentPos;
                }, function(response) {
                    console.log('error');
                }
            );
        }    
    };
    
     $scope.keyCmds = function($event){
        if ($event.keyCode != 38 && ($scope.currentPos === undefined || $scope.currentPos.x === undefined || $scope.currentPos.y === undefined || $scope.currentPos.f === undefined)){ 
            $scope.success = false;
            $scope.message = 'Start by placing the bus on the car park PLACE X, Y, F Or use the UP arrow key to place it at 0,0, NORTH';
            return;
        }
        if ($event.keyCode == 38){
            if ($scope.currentPos === undefined || $scope.currentPos.x === undefined || $scope.currentPos.y === undefined || $scope.currentPos.f === undefined) {
                $scope.controlBus('PLACE 0,0,NORTH');
            }
            else if($scope.currentPos.f === 'NORTH'){
                $scope.controlBus('MOVE');
            }
            else {
                $scope.controlBus('PLACE '+ $scope.currentPos.x + ',' + $scope.currentPos.y + ',' + 'NORTH');
            }
        } else if ($event.keyCode == 39) {
            if ($scope.currentPos === undefined || $scope.currentPos.x === undefined || $scope.currentPos.y === undefined || $scope.currentPos.f === undefined) {
                return;
            }
            
            if($scope.currentPos.f === 'EAST'){
                $scope.controlBus('MOVE');
            }
            else {
                $scope.controlBus('PLACE '+ $scope.currentPos.x + ',' + $scope.currentPos.y + ',' + 'EAST');
            }
        }
        else if ($event.keyCode == 40){
            if ($scope.currentPos === undefined || $scope.currentPos.x === undefined || $scope.currentPos.y === undefined || $scope.currentPos.f === undefined) {
                return;
            }
            
            if($scope.currentPos.f === 'SOUTH'){
                $scope.controlBus('MOVE');
            }
            else {
                $scope.controlBus('PLACE '+ $scope.currentPos.x + ',' + $scope.currentPos.y + ',' + 'SOUTH');
            }
        }    
        else if ($event.keyCode == 37){
            if ($scope.currentPos === undefined || $scope.currentPos.x === undefined || $scope.currentPos.y === undefined || $scope.currentPos.f === undefined) {
                return;
            }
            
            if($scope.currentPos.f === 'WEST'){
                $scope.controlBus('MOVE');
            }
            else {
                $scope.controlBus('PLACE '+ $scope.currentPos.x + ',' + $scope.currentPos.y + ',' + 'WEST');
            }
        }    
    };
    
});


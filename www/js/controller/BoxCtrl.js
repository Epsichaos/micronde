app.controller("BoxCtrl", function($scope, $ionicPlatform, $cordovaSQLite, $cordovaNativeAudio, DatabaseService, $q) {
    // when platform is ready, call $scope.init
    $ionicPlatform.ready(function() { $scope.init() })

    // init the database and when successful init the boxes
    $scope.init = function() {
        // call database singleton & init it
        DatabaseService.init().then(function(e) {
            console.log(e);
            $scope.loadBox();
        });
    }

    // Load box page
    $scope.loadBox = function() {
        console.log('BoxCtrl loadBox');
        if(window.cordova) {
            // objects
            $scope.collectionList = [];
            collectionList = [];
            // Select query
            var query = "SELECT * FROM sounds ORDER BY id ASC";
            $cordovaSQLite.execute(DatabaseService.getDatabase(),query).then(function(result) {
                if(result.rows.length > 0) {
                    console.log('LENGTH' + result.rows.length);
                    for(var i = 0; i < result.rows.length; i++) {
                        obj = {
                            'id': result.rows.item(i).id,
                            'soundName': result.rows.item(i).soundName
                        };
                        collectionList.push(obj);
                    }
                }
                else {
                    collectionList = [];
                }
                $scope.collectionList = collectionList;
                collectionList.forEach(function(e) {
                    console.log(e);
                    var soundPath = 'audio/' + e.id + '.m4a';

                    $cordovaNativeAudio
                        .preloadSimple(e.id, soundPath)
                        .then(function (msg) {
                            console.log('OK' + e.id);
                        }, function (error) {
                          console.log(error);
                        });

                })
            }, function(error) {
                console.log(error.message);
            });
        }
    }

    // play method, buggy after ~20 plays ?
    // TODO -> resolve this bug
    $scope.play = function(id) {
        console.log('clicked:' + id);
        $cordovaNativeAudio.play(id);
        /*
        var soundPath = 'audio/' + id + '.m4a';
        $cordovaNativeAudio.stop('music');
        $cordovaNativeAudio.unload('music');
        $cordovaNativeAudio
            .preloadSimple('music', soundPath)
            .then(function (msg) {
                console.log('OK' + id);
                $cordovaNativeAudio.play('music');
            }, function (error) {
              console.log(error);
            });
        */
    }

})

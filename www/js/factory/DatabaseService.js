//db singleton factory
angular.module('db.service', ['ngCordova'])
    .factory('DatabaseService', function($cordovaSQLite, $q) {
        // init db
        var db = null;

        var getDatabase = function() {
            return db;
        }

        /* init function*/
        var init = function() {
            console.log('init');
            // promise for init
            var deferred = $q.defer();
            db = $cordovaSQLite.openDB({name:'dev.box.gitans.db', location:'default'});
            //$cordovaSQLite.execute(db, "DROP TABLE sounds");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS sounds (id integer primary key, soundName text)");
            var countQuery = "SELECT * FROM sounds";
            $cordovaSQLite.execute(db,countQuery).then(function(result) {
                if(result.rows.length !== 17) {
                    console.log('launch generateAllDatabase');
                    generateAllDatabase().then(function(e) {
                        if(e === 'success') {
                            deferred.resolve('success');
                        }
                        else {
                            deferred.reject();
                        }
                    });
                }
                else {

                    deferred.resolve('success');
                }
            });
            return deferred.promise;
        }

        var generateAllDatabase = function() {
            var deferred = $q.defer();
            console.log('generateAllDatabase');
            var queries = [
                    {id: 1, soundName: "Jusqu'au bout"},
                    {id: 2, soundName: "Mais maintenant"},
                    {id: 3, soundName: "Votre responsabilité"},
                    {id: 4, soundName: "Partout en France"},
                    {id: 5, soundName: "Je veux"},
                    {id: 6, soundName: "C'est que vous"},
                    {id: 7, soundName: "Le faire gagner"},
                    {id: 8, soundName: "Notre projet"},
                    {id: 9, soundName: "Partout"},
                    {id: 10, soundName: "Vive la république"},
                    {id: 11, soundName: "Je vous aime farouchement"},
                    {id: 12, soundName: "Je l'aime"},
                    {id: 13, soundName: "C'est important de s'aimer"},
                    {id: 14, soundName: "Le murmure du printemps"},
                    {id: 15, soundName: "Je vous ai compris"},
                    {id: 16, soundName: "La république, elle doit aimer"},
                    {id: 17, soundName: "Je suis d'accord avec vous"}
            ]
            var query = "INSERT INTO sounds (id, soundName) VALUES (?,?)";
            queries.forEach(function(queryContent) {
                $cordovaSQLite.execute(db,query,[queryContent.id,queryContent.soundName]).then(function(result) {
                    //alert("INSERT ID -> " + result.insertId);
                    console.log(result.insertId);
                    if(result.insertId === 17) {
                        deferred.resolve('success');
                    }
                }, function(error) {
                    // alert(error);
                    deferred.resolve('error');
                    console.log('failure in inserting data' + error.message)
                });
            });
            return deferred.promise;
        }

        return {
            init: init,
            generateAllDatabase: generateAllDatabase,
            getDatabase: getDatabase
        };
    })

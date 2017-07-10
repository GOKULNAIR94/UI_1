var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {    $routeProvider
.when("/", {
        templateUrl : "main.html"
    })
.when("/newrecord", {
        templateUrl : "newrecord.html"
    })
    .when("/editrecord", {
        templateUrl : "editrecord.html"
    });
});

app.controller('mainCont', function ($scope, $http,$location) {
document.getElementById("thebody").style.cursor = "progress";
$location.path('\/');
        $scope.currentRecord = null;
        $http({
            method: 'GET',
            url: 'http://localhost:8888/main'
            
        }).then(function (response) {
            $scope.parent = response.data;
            $scope.endProcess();
        });

        
$scope.deal = function (id) {
$scope.startProcess();


	$location.path('\editrecord');
            $scope.currentRecord = id;

            $http({
                method: 'GET',
                url: 'http://localhost:8888/editrecord/' + id,
            }).then(function (response) {
                /*console.log(response);
                console.log(response.data[0]);
                console.log(response.data[1]);
                */

                $scope.record = response.data[0];
                $scope.child = response.data[1];
                $scope.endProcess();
            });

        };


        $scope.sendData = function (data1) {
$scope.startProcess();


            console.log(data1);
            var req = {
                method: 'POST',
                url: 'http://localhost:8888/newrecord/',
                data:data1
            }
            $http(req).then(function (result) {
                $location.path('\/');
                console.log(result);
                setTimeout(function () {
                    location.reload();
            }, 500);
            });
        };

        $scope.sendNewChild = function () {
$scope.startProcess();


            var req = {
                method: 'POST',
                url: 'http://localhost:8888/newchild/' + $scope.currentRecord,
                data: { "RecordName" : "New Record - "+ Date()}
            }

            $http(req).then(function (result) {        
	console.log(result);
            }).then(function (response) {
                //console.log(response);
                $scope.deal($scope.currentRecord);
            });
        };
// 	$scope.getInTable = function(){

// 	 $http({
//                     method: 'GET',
//                     url: 'https://acs.crm.ap2.oraclecloud.com/salesApi/resources/latest/TitleMaster_c/' + $scope.currentRecord + '/child/ReleaseVersionCollection_c',
//                     headers: {
//                         'Authorization': 'Basic RlVTSU9OQURNSU46QWdzQWRtaW5AMjAxNjA3',
//                         'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
//                     }
//                 }).then(function (response) {
//                     $scope.child = response.data;
// 	$scope.endProcess();

// 	});

// }


        $scope.update = function (id, parentdata, childdata, close) {
$scope.startProcess();


            delete parentdata.UserLastUpdateDate;
            delete parentdata.IsOwner;
            delete parentdata.LastUpdateDate;

            for (x in childdata) {
                delete childdata[x].UserLastUpdateDate;
                delete childdata[x].IsOwner;
                delete childdata[x].LastUpdateDate;

            }
            var req = {
                method: 'POST',
                url: 'http://localhost:8888/savep/' + id,
                data: parentdata
            }

            $http(req).then(function (result) {        
                console.log(result);
                for (x in childdata) {
                    $http({
                        method: 'POST',
                        url: 'http://localhost:8888/savec/' + id + '/'+ childdata[x].Id,
                        data: childdata[x]
                    }).then(function (res) { 
                    });
                }
            }).then(function (response) {
                if(close==0)
                    {
                        alert('Saved');
                        $scope.deal($scope.currentRecord);
                    }
                    else
                        location.reload();
            });
        };

        $scope.confirmDel = function (rName, rId) {
            if (confirm('Are you sure you want to delte ' + rName + '?')) {
                {
	$scope.startProcess();
                    $scope.delete(rId);
                }
            } else {
                //Do Nothing
            }
        };


        $scope.delete = function (id) {
$scope.startProcess();


            $http({
                method: 'POST',
                url: 'http://localhost:8888/deletep/' + id
            }).then(function (response) {

	$location.path('\/');
	setTimeout(function () {
                       location.reload();
            }, 1500);
                     
                    });

        };

        $scope.deleteChild = function (id) {
$scope.startProcess();


            $http({
                method: 'POST',
                url: 'http://localhost:8888/deletec/' + $scope.currentRecord + '/' + id
            }).then(function (response) {

	console.log('Record deleted.');
                                 setTimeout(function () {
                                    $scope.deal($scope.currentRecord);
                                	 //$scope.getInTable();
           		 }, 1500);
                     
                });

        };

$scope.startProcess = function () {
	document.getElementById("thebody").style.cursor = "progress";
 };

$scope.endProcess = function () {
	document.getElementById("thebody").style.cursor= "auto";
 };

        $scope.cancel = function () {
	$location.path('\/');
	setTimeout(function () {
		location.reload();
	}, 500);
        };
    });
const token = window.location.search.split('=')[1];
const app=angular.module("app", ['ngRoute']);
app.controller('MainController', ($scope,$http)=>{
	$http({
        method: "GET",
        url: "/main",
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function(response){
        console.log(response);
        $scope.msg='wellcome';
    }).catch((response)=>{
        if(response.status == 401){
             window.location.href='login.html';
        }
    })
})
app.config(function($routeProvider) {
    $routeProvider
    .when("/charts", {
        templateUrl : "charts.html"
    },()=>alert('ok'))
    .when("/game", {
        templateUrl : "game.html"
    })
});
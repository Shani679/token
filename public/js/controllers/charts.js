app.controller('Charts', ($scope,$http)=>{
	$scope.range=0;
    $scope.range2=0;
    $http({
        method: "GET",
        url: "/charts",
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function(response){
        $scope.dataToShow=response.data.data;
    }).catch((response)=>{
        if(response.status == 401){
             window.location.href='login.html';
        }
    })

	/*$http.get('/charts').then(function(response){
        console.log(response.headers);
        $scope.dataToShow=response.data.data;
	}).catch((response)=>{
		if(response.status == 401){
			window.location.href='login.html';
		}
	})*/
	$scope.updatePopValue=(value)=>{
		$scope.range=value;
        fetchPie($scope.dataToShow, $scope.range, "population", "container1")
	}
    $scope.updateAreaValue=(value)=>{
        $scope.range2=value;
        fetchPie($scope.dataToShow, $scope.range2, "area", "container2")
    }
})

function fetchPie(arr, range, field, container){
	Highcharts.chart(container, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: field
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: createObjectsArr(arr, range, field)
        }]
    });
}

function createObjectsArr(arr, range, field){
	var result=[];
	for (var i = 0; i < arr.length; i++) {
		if(arr[i][field]<=range){
			result.push({name: arr[i].name, y: arr[i][field]})
		}
	}
	return result;
}
app.controller('Game', ($scope,$http)=>{
	$scope.originalArr;
	$scope.randomArray;
	$scope.rightAnswer;
	$scope.score=0;
	$scope.amountShow=true;
	$scope.gameShow=false;
	$scope.scoreShow=false;
	$scope.currentLevel=0;
	$scope.error="";
	$scope.play=function(){
		if(!$scope.amount>0 && !$scope.amount<25){
			$scope.error="You have to choose a number first!";
		}else{
			$scope.amountShow=false;
			$scope.gameShow=true;
			$http({
		        method: "GET",
		        url: "/game",
		        headers: {
		            'Authorization': 'Bearer ' + token
		        }
		    }).then(function(response){
				$scope.randomArray=randomCountries(response.data.data, $scope.amount);
				$scope.originalArr=response.data.data;
			 	buildGame($scope.randomArray);
			}).catch(function(response){
			    if(response.status == 401){
					 window.location.href='login.html';
				}
			});
		}
	}
	
	function randomCountries(arr, n){
		const result=[];
		for(let i=0; i<n; i++){
			const temp=arr.splice((Math.floor(Math.random()*(arr.length))),1);
			result.push(temp[0]);
		}
		return result;
	}

	$scope.nextLevel = function(param) {
		if($scope[param]==$scope.rightAnswer.name){
			$scope.score++;
		}
		if($scope.randomArray.length > 0){
			buildGame($scope.randomArray)
		}else{
			$scope.gameShow=false;
			$scope.scoreShow=true;
		}
	}

	function buildGame(array){
		$scope.currentLevel++;
		const randomCountry=randomCountries(array, 1); 
		$scope.rightAnswer=randomCountry[0];
		$scope.flag=randomCountry[0].flag;
		const inCorrectAnswers=randomCountries($scope.originalArr, 3);
		inCorrectAnswers.push(randomCountry[0]);
		const shuffeldCountries=randomCountries(inCorrectAnswers, 4);
		$scope.country1=shuffeldCountries[0].name;
		$scope.country2=shuffeldCountries[1].name;
		$scope.country3=shuffeldCountries[2].name;
		$scope.country4=shuffeldCountries[3].name;
	}
})
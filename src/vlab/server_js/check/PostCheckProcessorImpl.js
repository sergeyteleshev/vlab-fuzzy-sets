function postCheck(preCheckResult, checkingResults, checkers){

    print(preCheckResult['value']);

    checkingResults.forEach(function(checkingResult){
        print('id: ' + checkingResult['id']);
        print('time: ' + checkingResult['time']);
        print('result: ' + checkingResult['result']);
        print('output: ' + checkingResult['output']);
    });

    checkers.forEach(function(checkProcessor){
        //????
        print(checkProcessor);
    });

}
function  preCheck(conditions, instructions, generatingResult){
    var preCheckResult = Java.type('rlcp.server.processor.check.PreCheckProcessor.PreCheckResult');

    conditions.forEach(function(conditionForChecking){
        print('id: ' + conditionForChecking['id']);
        print('time: ' + conditionForChecking['time']);
        print('input: ' + conditionForChecking['input']);
        print('output: ' + conditionForChecking['output']);
    });

    print(instructions);

    print(generatingResult['text']);
    print(generatingResult['code']);
    print(generatingResult['instructions']);

    var result = new preCheckResult("preCheckResult");
    return result;
}
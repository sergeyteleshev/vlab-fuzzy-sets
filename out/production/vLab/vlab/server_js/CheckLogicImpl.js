var literalOutput = "checkLogicText";
var logicFactory;

function checkSingleCondition(input, expectedOutput, instructions, preGenerated) {
    //do check logic here
    //preGenerated['text']
    //preGenerated['code']
    //preGenerated['instructions']
    var result;
    if (true) {
        result = 1;
        literalOutput = "ok";
    } else {
        result = 0;
        literalOutput = "bad";
    }
    return result;
};

function getOutput() {
    return literalOutput;
};

function newInstance() {
    return new CheckLogicImpl();
};

function newInstance(){
    return logicFactory.getCheckLogic();
};

function setLogicFactory(newLogicFactory){
    logicFactory = newLogicFactory;
};
var text = "generateLogicText";
var code = "generateLogicCode";
var instructions = "";
var logicFactory;

function process(algoritm){
    //do generate logic here
    text = "text";
    code = "code"
    instructions = "instructions"
};

function getText(){
    return text;
};

function getCode(){
    return code;
};

function getInstructions(){
    return instructions;
};

function newInstance(){
    return logicFactory.getGenerateLogic();
};

function setLogicFactory(newLogicFactory){
    logicFactory = newLogicFactory;
};
var text = "calculateLogicText";
var code = "calculateLogicCode";
var logicFactory;

function process(condition, instructions, preGenerated) {
    //do calculate logic here
    //preGenerated['text']
    //preGenerated['code']
    //preGenerated['instructions']
    text = "text";
    code = "code";
};

function  getText() {
    return text;
};

function getCode() {
    return code;
};

function newInstance() {
    return logicFactory.getCalculateLogic();
};

function setLogicFactory(newLogicFactory){
    logicFactory = newLogicFactory;
};

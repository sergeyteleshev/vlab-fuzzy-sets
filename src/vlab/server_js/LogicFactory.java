package vlab.server_js;

import rlcp.server.logic.CalculateLogic;
import rlcp.server.logic.CheckLogic;
import rlcp.server.logic.GenerateLogic;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class LogicFactory {
    private File generateLogicFile;
    private File checkLogicFile;
    private File calculateLogicFile;

    public void setGenerateLogicFile(File generateLogicFile) {
        this.generateLogicFile = generateLogicFile;
    }

    public void setCheckLogicFile(File checkLogicFile) {
        this.checkLogicFile = checkLogicFile;
    }

    public void setCalculateLogicFile(File calculateLogicFile) {
        this.calculateLogicFile = calculateLogicFile;
    }

    public GenerateLogic getGenerateLogic() {
        JSGenerateLogic logic = importJS(generateLogicFile).getInterface(JSGenerateLogic.class);
        logic.setLogicFactory(this);
        return logic;
    }

    public CheckLogic getCheckLogic(){
        JSCheckLogic logic = importJS(checkLogicFile).getInterface(JSCheckLogic.class);
        logic.setLogicFactory(this);
        return logic;
    }

    public CalculateLogic getCalculateLogic() {
        JSCalculateLogic logic = importJS(calculateLogicFile).getInterface(JSCalculateLogic.class);
        logic.setLogicFactory(this);
        return logic;
    }

    private Invocable importJS(File jsFile){
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        try {
            engine.eval(Files.newBufferedReader(jsFile.toPath()));

        } catch (ScriptException | IOException e) {
            e.printStackTrace();
        }
        return (Invocable) engine;
    }
}

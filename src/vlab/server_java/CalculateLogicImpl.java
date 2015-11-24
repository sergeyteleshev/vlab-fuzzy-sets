package vlab.server_java;


import rlcp.PreGenerated;
import rlcp.server.logic.CalculateLogic;

/**
 * Simple CalculateLogic implementation. Supposed to be changed as needed to provide necessary Calculate method support.
 * 
 * @author Eugene Efimcick
 */
public class CalculateLogicImpl implements CalculateLogic {
    
    private String text = "";
    private String code = "";

    @Override
    public void process(String condition, String instructions, PreGenerated preGenerated) {
        //do calculate logic here
        text = "text";
        code = "code";
    }
    
    @Override
    public String getText() {
        return text;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public CalculateLogic newInstance() {
        return new CalculateLogicImpl();
    }

}

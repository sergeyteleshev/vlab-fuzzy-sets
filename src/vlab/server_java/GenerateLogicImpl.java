package vlab.server_java;

import rlcp.server.logic.GenerateLogic;

import java.util.ArrayList;
import java.util.Random;

/**
 * Simple GenerateLogic implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 *
 * @author Eugene Efimcick
 */
public class GenerateLogicImpl implements GenerateLogic {
    
    private String text = "";
    private String code = "";
    private String instructions = "";

    @Override
    public void process(String algorithm) {
        //do Generate logic here
        text = "text";
        code = "code";
        instructions = "instructions";
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
    public String getInstructions() {
        return instructions;
    }

    public GenerateLogic newInstance() {
        return new GenerateLogicImpl();
    }

}

package vlab.server_java;

import rlcp.PreGenerated;
import rlcp.server.logic.CheckLogic;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

/**
 * Simple CheckLogic implementation. Supposed to be changed as needed to provide
 * necessary Check method support.
 *
 * @author Eugene Efimcick
 */
public class CheckLogicImpl implements CheckLogic {

    private String literalOutput = "";

    @Override
    public float checkSingleCondition(String input, String expectedOutput, String instructions, PreGenerated preGenerated) {

        float result;
        if (true) {
            result = 1;
            literalOutput = "ok";
        } else {
            result = 0;
            literalOutput = "bad";
        }
        return result;
    }


    @Override
    public CheckLogic newInstance() {
        return new CheckLogicImpl();
    }

    @Override
    public String getOutput() {
        return literalOutput;
    }
}

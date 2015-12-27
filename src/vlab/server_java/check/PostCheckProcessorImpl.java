package vlab.server_java.check;

import rlcp.check.CheckingResult;
import rlcp.server.processor.check.CheckProcessor;
import rlcp.server.processor.check.PostCheckProcessor;
import rlcp.server.processor.check.PreCheckProcessor;

import java.util.List;

import static rlcp.server.processor.check.PreCheckProcessor.*;

/**
 * Simple PostCheckProcessor implementation. Supposed to be changed as needed to provide
 * necessary after checking support.
 */
public class PostCheckProcessorImpl implements PostCheckProcessor{
    @Override
    public void postCheck(PreCheckResult preCheckResult, List<CheckingResult> checkingResults, List<CheckProcessor> checkers) {

    }
}

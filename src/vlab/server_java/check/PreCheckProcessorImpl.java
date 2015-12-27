package vlab.server_java.check;

import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.check.PreCheckProcessor;

import java.util.List;

/**
 * Simple PreCheckProcessor implementation. Supposed to be changed as needed to provide
 * necessary before checking support.
 */
public class PreCheckProcessorImpl implements PreCheckProcessor<String> {
    @Override
    public PreCheckResult preCheck(List<ConditionForChecking> conditions, String instructions, GeneratingResult generatingResult) {
        return new PreCheckResult("");
    }
}

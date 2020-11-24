package vlab.server_java.check;

import org.json.JSONArray;
import org.json.JSONObject;
import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.check.CheckProcessor;
import rlcp.server.processor.check.PreCheckProcessor;
import rlcp.server.processor.check.PreCheckProcessor.PreCheckResult;
import rlcp.server.processor.check.PreCheckResultAwareCheckProcessor;
import static vlab.server_java.Consts.*;
import java.math.BigDecimal;
import java.util.Arrays;

/**
 * Simple CheckProcessor implementation. Supposed to be changed as needed to provide
 * necessary Check method support.
 */
public class CheckProcessorImpl implements PreCheckResultAwareCheckProcessor<String> {
    @Override
    public CheckingSingleConditionResult checkSingleCondition(ConditionForChecking condition, String instructions, GeneratingResult generatingResult) throws Exception {
        //do check logic here
        BigDecimal points = new BigDecimal(1.0);
        String comment = "it's ok";

        try {
            String code = generatingResult.getCode();
            JSONObject jsonCode = new JSONObject(code); // сгенерированный вариант
            JSONObject jsonInstructions = new JSONObject(instructions); // ответ пользователя

            double[][] R1Set = twoDimensionalJsonArrayToDouble(jsonCode.getJSONArray("R1Set"));
            double[][] R2Set = twoDimensionalJsonArrayToDouble(jsonCode.getJSONArray("R2Set"));
            comment = Arrays.toString(getCompositionMatrix(R1Set, R2Set));
        }
        catch (Exception e)
        {
            points = BigDecimal.valueOf(0.0);
            comment = "Вы не заполнили все необходимые поля";
        }

        return new CheckingSingleConditionResult(points, comment);
    }

    static double find_max_element_in_array(double[] arr)
    {
        double max = arr[0];

        for (int i = 1; i < arr.length; i++)
            if (arr[i] > max)
                max = arr[i];

        return max;
    }

    private static double[][] getCompositionMatrix(double[][] R1Set, double[][] R2Set)
    {
        double[][] R1R2Set = new double[R1SetRowsAmount][R2SetColumnsAmount];
        for(int i = 0; i < R1SetRowsAmount; i++)
        {
            for (int j = 0; j < R2SetColumnsAmount; j++)
            {
                double[] minElements = new double[R1SetColumnsAmount];
                for(int k = 0; k < R1SetColumnsAmount; k++)
                {
                    minElements[k] = Math.min(R1Set[i][k], R2Set[k][j]);
                }

                R1R2Set[i][j] = Arrays.stream(minElements).max().getAsDouble();
            }
        }

        return R1R2Set;
    }

    public static double[][] twoDimensionalJsonArrayToDouble(JSONArray arr)
    {
        double[][] result = new double[arr.length()][arr.getJSONArray(0).length()];

        for(int i = 0; i < arr.length(); i++)
        {
            for(int j = 0; j < arr.getJSONArray(i).length(); j++)
            {
                result[i][j] = arr.getJSONArray(i).getDouble(j);
            }
        }

        return result;
    }

    @Override
    public void setPreCheckResult(PreCheckResult<String> preCheckResult) {}
}

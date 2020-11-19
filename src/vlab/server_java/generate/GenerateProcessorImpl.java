package vlab.server_java.generate;

import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.concurrent.ThreadLocalRandom;

import org.json.JSONObject;

import static vlab.server_java.Consts.*;

/**
 * Simple GenerateProcessor implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 */
public class GenerateProcessorImpl implements GenerateProcessor {
    @Override
    public GeneratingResult generate(String condition) {
        //do Generate logic here
        String text = "text";
        String code = "code";
        String instructions = "instructions";
        JSONObject answer = new JSONObject();

        double[][] R1Set = new double[R1SetRowsAmount][R1SetColumnsAmount];
        double[][] R2Set = new double[R2SetRowsAmount][R2SetColumnsAmount];

        //сначала просто генерируем множества с числами без учёта значимого элемента
        for(int i = 0; i < R1Set.length; i++)
        {
            for(int j = 0; j < R1Set[i].length; j++)
            {
                R1Set[i][j] = roundDoubleToNDecimals(generateRandomDoubleRange(setMinValue, setMaxValue), 1);
            }
        }

        for(int i = 0; i < R2Set.length; i++)
        {
            for(int j = 0; j < R2Set[i].length; j++)
            {
                R2Set[i][j] = roundDoubleToNDecimals(generateRandomDoubleRange(setMinValue, setMaxValue), 1);
            }
        }

        //проходимся по каждому множетсву и заменяем числа на значимый элемент
        for(int i = 0; i < R1Set.length; i++)
        {
            boolean isCurrentRawValid = false;
            for(int j = 0; j < R1Set[i].length; j++)
            {
                if (R1Set[i][j] >= alpha)
                {
                    isCurrentRawValid = true;
                    break;
                }
            }

            if(!isCurrentRawValid)
            {
                int randomColumnElementIndex = generateRandomIntRange(0, R1Set.length);
                R1Set[i][randomColumnElementIndex] = generateRandomDoubleRange(alpha, setMaxValue);
            }
        }

        answer.put("R1Set", R1Set);
        answer.put("R2Set", R2Set);

        code = answer.toString();
        text = "Постройте нечетое множество из множетсв R1 и R2";

        return new GeneratingResult(text, code, instructions);
    }

    private static double roundDoubleToNDecimals(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = new BigDecimal(Double.toString(value));
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    public static double generateRandomDoubleRange(double min, double max)
    {
        return ThreadLocalRandom.current().nextDouble(min, max + 1);
    }

    public static int generateRandomIntRange(int min, int max)
    {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}

package vlab.server_java.generate;

import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
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
        try
        {
            String text = "text";
            String code = "code";
            String instructions = "instructions";
            JSONObject answer = new JSONObject();

            double alpha = alphaValues[generateRandomIntRange(0, alphaValues.length - 1)];

            int n = matrixSizes[generateRandomIntRange(0, matrixSizes.length - 1)];
            int m = matrixSizes[generateRandomIntRange(0, matrixSizes.length - 1)];
            int k = n;

            while (n == k)
            {
                k = matrixSizes[generateRandomIntRange(0, matrixSizes.length - 1)];
            }

            double[][] R1Set = generateInitialSet(n, m);
            double[][] R2Set = generateInitialSet(m, k);

//            double[][] R1Set = {
//                    {0.8, 0.5, 0.2, 0.9},
//                    {1, 0.9, 0.7, 0.3},
//                    {0.7, 0.5, 0, 0.5}
//            };
//
//            double[][] R2Set = {
//                    {0.8, 0.5},
//                    {0.2, 0.7},
//                    {0.9, 0.3},
//                    {1, 0.7}
//            };

            answer.put("R1Set", R1Set);
            answer.put("R2Set", R2Set);
            answer.put("alpha", alpha);
            answer.put("m", m);
            answer.put("n", n);
            answer.put("k", k);

            code = answer.toString();
            text = "Уровень α = " + alpha + ", значащий элемент = " + significantElement;
            return new GeneratingResult(text, code, instructions);
        }
        catch(IllegalArgumentException ioex)
        {
            throw new IllegalArgumentException(ioex);
        }
    }

    private static double[][] generateInitialSet(int rowsAmount, int columnsAmount)
    {
        double[][] set = new double[rowsAmount][columnsAmount];

        //сначала просто генерируем множества с числами без учёта значимого элемента
        for(int i = 0; i < rowsAmount; i++)
        {
            for(int j = 0; j < columnsAmount; j++)
            {
                set[i][j] = roundDoubleToNDecimals(generateRandomDoubleRange(setMinValue, setMaxValue), 1);
            }
        }

        //проходимся по каждому множетсву и заменяем числа на значимый элемент в каждой СТРОКЕ
        for(int i = 0; i < rowsAmount; i++)
        {
            boolean isCurrentRowValid = false;
            for(int j = 0; j < columnsAmount; j++)
            {
                if (set[i][j] >= significantElement)
                {
                    isCurrentRowValid = true;
                    break;
                }
            }

            if(!isCurrentRowValid)
            {
                int randomColumnElementIndex = generateRandomIntRange(0, set[i].length - 1);
                set[i][randomColumnElementIndex] = roundDoubleToNDecimals(generateRandomDoubleRange(significantElement, setMaxValue), 1);
            }
        }

        //проходимся по каждому множетсву и заменяем числа на значимый элемент в каждом СТОЛБЦЕ
        for(int i = 0; i < columnsAmount; i++)
        {
            boolean isCurrentColumnValid = false;
            for(int j = 0; j < rowsAmount; j++)
            {
                if(set[j][i] >= significantElement)
                {
                    isCurrentColumnValid = true;
                    break;
                }
            }

            if(!isCurrentColumnValid)
            {
                int randomRowElementIndex = generateRandomIntRange(0, rowsAmount - 1);
                set[randomRowElementIndex][i] = roundDoubleToNDecimals(generateRandomDoubleRange(significantElement, setMaxValue), 1);
            }
        }

        return set;
    }

    private static double roundDoubleToNDecimals(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = new BigDecimal(Double.toString(value));
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    public static double generateRandomDoubleRange(double min, double max)
    {
        return Math.random() * (max - min) + min;
    }

    public static int generateRandomIntRange(int min, int max)
    {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}

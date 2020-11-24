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

//        double[][] R1Set = generateInitialSet(R1SetRowsAmount, R1SetColumnsAmount);
//        double[][] R2Set = generateInitialSet(R2SetRowsAmount, R2SetColumnsAmount);

        double[][] R1Set = {
            {0.8, 0.5, 0.2, 0.9},
            {1, 0.9, 0.7, 0.3},
            {0.7, 0.5, 0, 0.5},
        };
        double[][] R2Set = {
            {0.8, 0.5},
            {0.2, 0.7},
            {0.9, 0.3},
            {1, 0.7},
        };

        answer.put("R1Set", R1Set);
        answer.put("R2Set", R2Set);

        code = answer.toString();
        text = "Постройте нечетое множество из множетсв R1 и R2";

        return new GeneratingResult(text, code, instructions);
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
                int validColumn = 0;
                boolean isValidColumnFound = false;
                while (!isValidColumnFound)
                {
                    for(int t = 0; t < rowsAmount; t++)
                        if(set[randomRowElementIndex][t] >= significantElement)
                            continue;
                        else
                            validColumn = t;

                    isValidColumnFound = true;
                }

                set[randomRowElementIndex][validColumn] = roundDoubleToNDecimals(generateRandomDoubleRange(significantElement, setMaxValue), 1);
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

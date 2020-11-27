package vlab.server_java.check;

import org.json.JSONArray;
import org.json.JSONObject;
import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
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
        double points = 0;
        String comment = "";

        String code = generatingResult.getCode();
        JSONObject jsonCode = new JSONObject(code); // сгенерированный вариант
        JSONObject jsonInstructions = new JSONObject(instructions); // ответ пользователя

        double[][] serverR1Set = twoDimensionalJsonArrayToDouble(jsonCode.getJSONArray("R1Set"));
        double[][] serverR2Set = twoDimensionalJsonArrayToDouble(jsonCode.getJSONArray("R2Set"));
        double alpha = jsonCode.getDouble("alpha");

        double[][] clientCompositionMatrix = twoDimensionalJsonArrayToDouble(jsonInstructions.getJSONArray("compositionMatrix"));
        int[][] clientSignificanceMatrix = twoDimensionalJsonArrayToInt(jsonInstructions.getJSONArray("significanceMatrix"));
        int clientCompositionMatrixColumns = jsonInstructions.getInt("compositionMatrixColumns");
        int clientCompositionMatrixRows = jsonInstructions.getInt("compositionMatrixRows");


        double[][] serverCompositionMatrix = getCompositionMatrix(serverR1Set, serverR2Set);
        int[][] serverSignificanceMatrix = getSignificanceMatrix(serverCompositionMatrix, alpha);
        double serverCompositionMatrixRows = serverCompositionMatrix.length;
        double serverCompositionMatrixColumns = serverCompositionMatrix[0].length;

        if(serverCompositionMatrixColumns == clientCompositionMatrixColumns)
        {
            points += compositionMatrixSizePoints / 2;
        }
        else
        {
            comment += "Неверное количество столбцов в композиционной матрице. ";
        }

        if(serverCompositionMatrixRows == clientCompositionMatrixRows)
        {
            points += compositionMatrixSizePoints / 2;
        }
        else
        {
            comment += "Неверное количество строк в композиционной матрице.";
        }

        if(points == compositionMatrixSizePoints)
        {
            JSONObject compositionMatrixCheckAnswer = checkCompositionMatrix(serverCompositionMatrix, clientCompositionMatrix, compositionMatrixPoints);
            JSONObject significanceMatrixCheckAnswer = checkSignificanceMatrix(serverSignificanceMatrix, clientSignificanceMatrix, significanceMatrixPoints);

            double compositionMatrixPoints = compositionMatrixCheckAnswer.getDouble("points");
            String compositionMatrixComment = compositionMatrixCheckAnswer.getString("comment");

            double significanceMatrixPoints = significanceMatrixCheckAnswer.getDouble("points");
            String significanceMatrixComment = significanceMatrixCheckAnswer.getString("comment");

            points += compositionMatrixPoints + significanceMatrixPoints;
            comment += compositionMatrixComment + significanceMatrixComment;
        }

        return new CheckingSingleConditionResult(BigDecimal.valueOf(points), comment);
    }

    static JSONObject checkSignificanceMatrix(int[][] clientAnswer, int[][] serverAnswer, double points)
    {
        double matrixColumnsAmount = serverAnswer.length;
        double matrixRowsAmount = serverAnswer[0].length;
        double deltaPoints = points / (matrixColumnsAmount * matrixRowsAmount);
        double clientPoints = 0;
        StringBuilder comment = new StringBuilder();
        JSONObject result = new JSONObject();

        try
        {
            for(int i = 0; i < serverAnswer.length; i++)
            {
                for(int j = 0; j < serverAnswer[i].length; j++)
                {
                    if(serverAnswer[i][j] == clientAnswer[i][j])
                        clientPoints += deltaPoints;
                    else
                    {
                        comment.append("Неверное значение элемента SM[").append(Integer.toString(i + 1)).append(", ").append(Integer.toString(j + 1)).append("] матрицы устойчивости. ");
                    }
                }
            }
        }
        catch (ArrayIndexOutOfBoundsException e)
        {
            comment = new StringBuilder("Неверный размер матрицы.");
            clientPoints = 0;
        }

        result.put("points", clientPoints);
        result.put("comment", comment.toString());

        return result;
    }

    static JSONObject checkCompositionMatrix(double[][] clientAnswer, double[][] serverAnswer, double points)
    {
        double matrixColumnsAmount = serverAnswer.length;
        double matrixRowsAmount = serverAnswer[0].length;
        double deltaPoints = points / (matrixColumnsAmount * matrixRowsAmount);
        double clientPoints = 0;
        StringBuilder comment = new StringBuilder();
        JSONObject result = new JSONObject();

        try
        {
            for(int i = 0; i < serverAnswer.length; i++)
            {
                for(int j = 0; j < serverAnswer[i].length; j++)
                {
                    if(serverAnswer[i][j] == clientAnswer[i][j])
                        clientPoints += deltaPoints;
                    else
                    {
                        comment.append("Неверное значение элемента CM[").append(Integer.toString(i + 1)).append(", ").append(Integer.toString(j + 1)).append("] композиционной матрицы. ");
                    }
                }
            }
        }
        catch (ArrayIndexOutOfBoundsException e)
        {
            comment = new StringBuilder("Неверный размер матрицы. ");
            clientPoints = 0;
        }

        result.put("points", clientPoints);
        result.put("comment", comment.toString());

        return result;
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

    private static int[][] getSignificanceMatrix(double[][] compositionMatrix, double alpha)
    {
        int[][] significanceMatrix = new int[compositionMatrix.length][compositionMatrix[0].length];

        for(int i = 0; i < significanceMatrix.length; i++)
        {
            for(int j = 0; j < significanceMatrix[0].length; j++)
            {
                if(compositionMatrix[i][j] >= alpha)
                {
                    significanceMatrix[i][j] = 1;
                }
                else
                {
                    significanceMatrix[i][j] = 0;
                }
            }
        }

        return significanceMatrix;
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

    public static int[][] twoDimensionalJsonArrayToInt(JSONArray arr)
    {
        int[][] result = new int[arr.length()][arr.getJSONArray(0).length()];

        for(int i = 0; i < arr.length(); i++)
        {
            for(int j = 0; j < arr.getJSONArray(i).length(); j++)
            {
                result[i][j] = arr.getJSONArray(i).getInt(j);
            }
        }

        return result;
    }

    @Override
    public void setPreCheckResult(PreCheckResult<String> preCheckResult) {}
}

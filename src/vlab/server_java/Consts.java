package vlab.server_java;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Consts
{
    public static final int[] matrixSizes = {2, 3, 4, 5};

    public static final double significantElement = 0.7;
    public static final double[] alphaValues = {0.7, 0.8, 0.9};

    public static final double setMinValue = 0.1;
    public static final double setMaxValue = 1;

    public static final double compositionMatrixSizePoints = 0.1;
    public static final double compositionMatrixPoints = 0.6;
    public static final double significanceMatrixPoints = 0.3;

    public static double roundDoubleToNDecimals(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = new BigDecimal(Double.toString(value));
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
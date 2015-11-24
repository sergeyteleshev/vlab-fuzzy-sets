package vlab.tool.util;

import javax.swing.*;
import java.awt.*;

/**
 * Common functions for components styling.
 */
public class Styler {

    private static final Color selectedValueColor = new Color(250, 240, 200);
    private static final Color selectedShadowValueColor = new Color(250, 240, 230);
    private static final Color selectedHeaderColor = new Color(225, 225, 225);
    private static final Color zerosColor = new Color(225, 225, 225);

    public static void initStyleValue(JComponent component) {
        setUnselectedStyleValue(component);
        component.setOpaque(true);
        if (component.getClass().equals(JLabel.class))
            ((JLabel) component).setHorizontalAlignment(SwingConstants.CENTER);
        if (component.getClass().equals(JFormattedTextField.class))
            ((JFormattedTextField) component).setHorizontalAlignment(SwingConstants.CENTER);
        component.setBorder(BorderFactory.createLineBorder(Color.darkGray));
    }


    public static void initStyleHeader(JComponent component) {
        setUnselectedStyleHeader(component);
        component.setOpaque(true);
        if (component.getClass().equals(JLabel.class))
            ((JLabel) component).setHorizontalAlignment(SwingConstants.CENTER);
        component.setBorder(BorderFactory.createLineBorder(Color.darkGray));
    }

    public static void setUnselectedStyleHeader(JComponent component) {
        component.setBackground(Color.lightGray);
    }

    public static void setUnselectedStyleValue(JComponent component) {
        component.setBackground(Color.white);
        if (component.getClass().equals(JFormattedTextField.class)) {
            if (((JFormattedTextField) component).getText().equals("0"))
                ((JFormattedTextField) component).setForeground(zerosColor);
            else
                ((JFormattedTextField) component).setForeground(Color.black);
        }
    }


    public static void setSelectedStyleHeader(JComponent component) {
        component.setBackground(selectedHeaderColor);
    }

    public static void setSelectedStyleValue(JComponent component) {
        component.setBackground(selectedValueColor);
        if (component.getClass().equals(JFormattedTextField.class)) {
            ((JFormattedTextField) component).setForeground(Color.black);
        }
    }

    public static void setSelectedStyleShadowValue(JComponent component) {
        component.setBackground(selectedShadowValueColor);
    }


}

package vlab.tool.util;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JTextArea;
import rlcp.console.Console;

/**
 *  This button shows dialog with result of getResults() method.
 */
public class GetResultsButton extends JButton {

    public GetResultsButton(String text, final Console console) {
        super(text);
        addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                JDialog helpDialog = new JDialog();
                helpDialog.add(new JTextArea(console.getResults()));
                helpDialog.setVisible(true);
            }
        });
    }
}

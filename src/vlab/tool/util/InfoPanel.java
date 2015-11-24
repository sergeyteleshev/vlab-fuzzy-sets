package vlab.tool.util;

import java.awt.BorderLayout;
import java.awt.Dialog;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.util.Locale;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JEditorPane;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;
import javax.swing.UIDefaults;
import javax.swing.UIManager;
import rlcp.console.Console;
import vlab.tool.ToolImpl;

/**
 *  Typical top panel with VL name, helpButton and localizer box.
 */
public class InfoPanel extends JPanel{

    public InfoPanel(String name, String helpHtml, int defWidth, int defHeight, ToolImpl tool) {
        JButton helpButton = new JButton("?");
        helpButton.addActionListener(new HelpMenuListener(helpHtml, defWidth, defHeight));
        helpButton.setToolTipText(Localizer.get("Справка"));
        
        JComboBox localizerBox = new JComboBox(Localizer.getLocales().toArray());
        localizerBox.addItemListener(new LocaleItemListener(tool));
        
        JPanel controlsPanel = new JPanel(new BorderLayout(3,3));
        controlsPanel.add(helpButton, BorderLayout.EAST);
        controlsPanel.add(localizerBox, BorderLayout.WEST);
        
        JLabel headerLabel = new JLabel(name);
        headerLabel.setFont(headerLabel.getFont().deriveFont(Font.BOLD));
        headerLabel.setHorizontalAlignment(SwingConstants.CENTER);

        setLayout(new BorderLayout());
        
        add(headerLabel);
        add(controlsPanel, BorderLayout.EAST);
        
        setBorder(BorderFactory.createEtchedBorder());
    }
    
    
    private static class HelpMenuListener implements ActionListener {
        private String helpHtml;
        private int defWidth;
        private int defHeight;
        
        private JEditorPane textPane;

        public HelpMenuListener(String helpHtml, int defWidth, int defHeight) {
            this.helpHtml = helpHtml;
            this.defWidth = defWidth;
            this.defHeight = defHeight;
            
            makeTextPane();
        }
        

        @Override
        public void actionPerformed(ActionEvent e) {
            JDialog helpDialog = new JDialog();
            helpDialog.setModalityType(Dialog.ModalityType.APPLICATION_MODAL);
            helpDialog.add(textPane);
            ((JPanel) helpDialog.getContentPane()).setBorder(BorderFactory.createEmptyBorder(3, 3, 3, 3));
            helpDialog.setSize(defWidth, defHeight);
            helpDialog.setLocationRelativeTo(((JComponent) e.getSource()).getTopLevelAncestor());
            helpDialog.setVisible(true);

        }

        private void makeTextPane() {
            textPane = new JEditorPane("text/html", helpHtml);
            textPane.setEditable(false);
            textPane.setFocusable(false);
            UIDefaults defaults = new UIDefaults();
            defaults.put("EditorPane[Enabled].backgroundPainter", UIManager.getColor("Panel.background"));
            textPane.putClientProperty("Nimbus.Overrides", defaults);
            textPane.putClientProperty("Nimbus.Overrides.InheritDefaults", true);
            textPane.setBackground(UIManager.getColor("Panel.background"));
        }
    }

    private static class LocaleItemListener implements ItemListener {
        private ToolImpl tool;

        public LocaleItemListener(ToolImpl tool) {
            this.tool = tool;
        }
        
        public void itemStateChanged(ItemEvent e) {
            if (e.getStateChange() == ItemEvent.SELECTED){
                Localizer.switchLocale((Locale) e.getItem());
                tool.initComponents();
            }
            
        }
    }
}

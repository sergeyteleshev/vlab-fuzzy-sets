package vlab.tool;


import java.awt.BorderLayout;
import javax.swing.JApplet;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.LookAndFeel;
import javax.swing.UIManager;
import rlcp.console.Console;
import vlab.tool.util.InfoPanel;
import vlab.tool.util.Localizer;

/**
 * Basic Virtual laboratory tool implementation. supposed to be changed as
 * needed to provide necessary user interface.
 * 
 * @author Eugene Efimchick
 */
public class ToolImpl extends JApplet implements Console {
    
    private final String helpHtml = "<html><h3><center>Help text goes there";
    String preGeneratedCode;
    @Override
    public void init() {
        try {
            initData();
            initComponents();
        } catch (Exception e) {
            add(new JLabel("Произошла ошибка инициализации"), BorderLayout.NORTH);
        }
    }

    /**
     * Read params and init model
     */
    private void initData() {
        preGeneratedCode = ParamReader.readPreGeneratedCodeParam(this);
        String previousSolution = ParamReader.readPreviousSolutionParam(this);
        
        
    }
    
    /**
     * Init GUI
     */
    public void initComponents() {
        resetNimbusContentPane();
        
        add(new InfoPanel("Hello World", helpHtml, 500, 500, this), BorderLayout.NORTH);
        add(new JLabel(Localizer.get("Справка")));
        
        JTextField f = new JTextField();
        f.setText(preGeneratedCode);
        add(f, BorderLayout.CENTER);
        
    }

    @Override
    public String getResults() {
        return "nothing";
    }
    
    /**
     * Apply Nimbus LnF
     */
    private void resetNimbusContentPane() {
        try {
            UIManager.setLookAndFeel((LookAndFeel) Class.forName("javax.swing.plaf.nimbus.NimbusLookAndFeel").newInstance());
        } catch (Exception ex) {
            try {
                UIManager.setLookAndFeel(new com.sun.java.swing.plaf.nimbus.NimbusLookAndFeel());
            } catch (Exception e) {
            }
        } finally {
            setContentPane(new JPanel(new BorderLayout()));
        }
    }
}

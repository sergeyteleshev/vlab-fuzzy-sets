package test;

import java.io.File;
import java.io.FilenameFilter;
import rlcp.server.logger.Logger;
import vlab.server_java.Starter;


/**
 * Main class for RLCP-server testing starting. Gets test files from var/input and runs test for each one of them. Results are saved in var/output.
 * 
 * @author Eugene Efimchick
 */
public class TestStarter {

    /**
     * Main method for test start. Starts server and processes test files.
     */
    public static void main(String[] args) {
        Thread serverThread = startNewServerThread();
        testVLab("var/input", "var/output");
        closeAndExit(serverThread);
    }

    private static Thread startNewServerThread() {
        Thread serverThread = new Thread() {

            @Override
            public void run() {
                Starter.main(null);
            }
        };
        serverThread.start();
        return serverThread;
    }

    private static void testVLab(String inputPath, String outputPath) {
        new File(outputPath).mkdirs();
        File[] testFiles = new File(inputPath).listFiles(new XmlFilenameFilter());
        for (int i = 0; i < testFiles.length; i++) {
            testFile(testFiles[i], outputPath);
        }
        Logger.log("Thats all. Look at " + outputPath + " to see servers output!");
    }

    private static void testFile(File file, String outputPath) {
        try {
            Tester fileTester = new Tester(file);
            fileTester.test(outputPath);
        } catch (Exception exc) {
            Logger.log("test.Tester FAILED at " + file.getAbsolutePath());
            Logger.log(exc);
        }
    }

    private static void closeAndExit(Thread serverThread) {
        try {
            serverThread.interrupt();
        } catch (Exception intExc) {
            //no matter
        }
        System.exit(0);
    }

    private static class XmlFilenameFilter implements FilenameFilter {

        @Override
        public boolean accept(File dir, String name) {
            return name.toLowerCase().endsWith(".xml");
        }
    }
}

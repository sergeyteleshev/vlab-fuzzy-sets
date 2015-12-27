package vlab.server_java;

import org.springframework.context.support.GenericXmlApplicationContext;
import rlcp.server.Server;
import rlcp.server.processor.*;
import rlcp.server.processor.factory.DefaultConstructorProcessorFactory;
import rlcp.server.processor.factory.ProcessorFactory;
import rlcp.server.processor.factory.ProcessorFactoryContainer;
import vlab.server_java.calculate.CalculateProcessorImpl;
import vlab.server_java.check.CheckProcessorImpl;
import vlab.server_java.check.PostCheckProcessorImpl;
import vlab.server_java.check.PreCheckProcessorImpl;
import vlab.server_java.generate.GenerateProcessorImpl;

/**
 * Main class for RLCP-server starting.
 */
public class Starter {

    /**
     * Defines applicable logic modules, configuration path and starts RLCP-server
     */
    public static void main(String[] args) {
        GenericXmlApplicationContext context = new GenericXmlApplicationContext();
        context.load("classpath:vlab/server_java/java-server-config.xml");
        context.refresh();

        context.getBean("server", Server.class).startServer();
    }
}

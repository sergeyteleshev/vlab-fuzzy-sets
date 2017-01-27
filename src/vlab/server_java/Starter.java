package vlab.server_java;

import org.springframework.context.support.GenericXmlApplicationContext;
import rlcp.*;
import rlcp.generate.RlcpGenerateResponseBody;
import rlcp.method.RlcpMethod;
import rlcp.server.Server;
import rlcp.server.ServerMethod;
import rlcp.server.config.Config;
import rlcp.server.config.ConfigParser;
import rlcp.server.flow.RlcpRequestFlow;
import rlcp.server.processor.factory.ProcessorFactoryContainer;

import java.io.BufferedReader;
import java.io.File;
import java.nio.CharBuffer;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Main class for RLCP-server starting.
 */
public class Starter {

    /**
     * Defines applicable logic modules, configuration path and starts RLCP-server
     */
    public static void main(String[] args) throws Exception {
        GenericXmlApplicationContext context = new GenericXmlApplicationContext();
        context.load("classpath:vlab/server_java/java-server-config.xml");
        context.refresh();

        if (args.length == 0) {
            new Thread(context.getBean("server", Server.class)).start();
        } else{
            File request = new File(args[0]);
            String rawRequest = readFile(request.toPath());

            RlcpRequestBody rlcpRequestBody = Rlcp.parseRequestBody(rawRequest);
            RlcpRequestFlow flow = null;
            switch (rlcpRequestBody.getMethod().getName().toLowerCase()) {
                case "generate":
                    flow = ServerMethod.GENERATE.getFlow();
                    break;
                case "check":
                    flow = ServerMethod.CALCULATE.getFlow();
                    break;
                case "calculate":
                    flow = ServerMethod.CHECK.getFlow();
                    break;
            }

            RlcpResponseBody responseBody = flow
                    .processBody(context.getBean("container", ProcessorFactoryContainer.class), rlcpRequestBody);
            System.out.println(responseBody);
        }
    }

    private static String readFile(Path p) {
        String rawRequest = "";
        try {
            StringBuilder rawRequestBuilder = new StringBuilder();
            CharBuffer charBuffer = CharBuffer.allocate((int) Files.size(p));
            BufferedReader br = Files.newBufferedReader(p);
            while (br.ready()) {
                br.read(charBuffer);
                charBuffer.flip();
                rawRequestBuilder.append(charBuffer.toString());
            }
            rawRequest = rawRequestBuilder.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rawRequest;
    }
}
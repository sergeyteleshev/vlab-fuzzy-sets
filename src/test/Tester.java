package test;

import java.io.File;
import java.io.FileOutputStream;
import java.io.StringReader;
import java.nio.charset.Charset;
import org.dom4j.Document;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;
import rlcp.RlcpRequest;
import rlcp.RlcpResponse;
import rlcp.calculate.RlcpCalculateRequestBody;
import rlcp.check.RlcpCheckRequestBody;
import rlcp.exception.BadRlcpBodyException;
import rlcp.generate.RlcpGenerateRequestBody;
import rlcp.method.Calculate;
import rlcp.method.Check;
import rlcp.method.Generate;

/**
 * Testing class. Reads test file in constructor, processes testing in {@code test()}
 * method.
 *
 * @author Eugene Efimchick
 */
public class Tester {

    String url = "";
    String rlcpRequest = "";
    String outputFileName = "";
    String method = "";

    /**
     * Constructor. Also parses test config from test file.
     *
     * @param testFile test file
     * @throws Exception if any occured
     */
    public Tester(File testFile) throws Exception {
        readConfig(testFile.getPath());
        outputFileName = testFile.getName();
    }

    /**
     * Test method. Parses request, sends to RLCP-server
     *
     * @param outPath output path
     * @throws Exception
     */
    public void test(String outPath) throws Exception {
        try {
            RlcpRequest request = prepareRequest();
            RlcpResponse response = request.execute();
            saveOutputFile(outPath, response.toString());
        } catch (Exception exc) {
            throw exc;
        }
    }

    private void readConfig(String path) throws Exception {
        Document doc = new SAXReader().read(path);
        url = doc.selectSingleNode("//URL").getText().substring("url:".length());
        method = doc.selectSingleNode("//Method").getText();
        rlcpRequest = doc.selectSingleNode("//RLCPRequest/.//*").asXML();
    }

    private RlcpRequest prepareRequest() {
        RlcpRequest request = null;
        if (method.equalsIgnoreCase("check")) {
            try {
                RlcpCheckRequestBody requestBody = (RlcpCheckRequestBody) Check.getInstance().getParser().parseRequestBody("<?xml version=\"1.0\" encoding=\"" + Charset.defaultCharset().toString() + "\"?>" + rlcpRequest);
                request = Check.getInstance().buildRequest(url, requestBody);
            } catch (BadRlcpBodyException ex) {
                ex.printStackTrace();
            }
        } else if (method.equalsIgnoreCase("generate")) {
            try {
                RlcpGenerateRequestBody requestBody = Generate.getInstance().getParser().parseRequestBody("<?xml version=\"1.0\" encoding=\"" + Charset.defaultCharset().toString() + "\"?>" + rlcpRequest);
                request = Generate.getInstance().buildRequest(url, requestBody);
            } catch (BadRlcpBodyException ex) {
                ex.printStackTrace();
            }
        } else if (method.equalsIgnoreCase("calculate")) {
            try {
                RlcpCalculateRequestBody requestBody = Calculate.getInstance().getParser().parseRequestBody("<?xml version=\"1.0\" encoding=\"" + Charset.defaultCharset().toString() + "\"?>" + rlcpRequest);
                request = Calculate.getInstance().buildRequest(url, requestBody);
            } catch (BadRlcpBodyException ex) {
                ex.printStackTrace();
            }
        }
        return request;
    }

    private void saveOutputFile(String path, String source) throws Exception {
        if (source.indexOf("<") >= 0) {
            source = source.substring(source.indexOf("<"));
            saveOutputXml(path + File.separator + outputFileName, source);
        } else {
            saveOutputNoStandard(path + File.separator + outputFileName, source);
        }
    }

    private void saveOutputNoStandard(String path, String source) throws Exception {
        FileOutputStream fos = new FileOutputStream(path);
        fos.write(source.getBytes());
        fos.close();
    }

    private void saveOutputXml(String path, String source) throws Exception {
        Document xdoc = new SAXReader().read(new StringReader(source));
        XMLWriter wr = new XMLWriter(new FileOutputStream(path), OutputFormat.createPrettyPrint());
        wr.write(xdoc);
        wr.close();
    }
}

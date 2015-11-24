package vlab.server_js;

import org.springframework.context.support.GenericXmlApplicationContext;
import rlcp.method.Calculate;
import rlcp.server.Server;
import rlcp.server.logic.CalculateLogic;
import rlcp.server.logic.CheckLogic;
import rlcp.server.logic.GenerateLogic;
import rlcp.server.logic.LogicContainer;

/**
 * Main class for RLCP-server starting.
 *
 * @author Eugene Efimchick
 */
public class Starter {

    /**
     * Defines applicable logic modules, configuration path and starts RLCP-server
     */
    public static void main(String[] args) {
        GenericXmlApplicationContext context = new GenericXmlApplicationContext();
        context.load("classpath:vlab/server_js/js-server-config.xml");
        context.refresh();

        context.getBean("server", Server.class).startServer();
    }
}

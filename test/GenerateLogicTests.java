import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import rlcp.server.logic.GenerateLogic;
import vlab.server_java.GenerateLogicImpl;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNot.not;
import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:test-java-server-config.xml")
public class GenerateLogicTests {

    @Autowired
    private GenerateLogic generateLogic;

    @Test
    public void testProcess(){
        assertEquals("", generateLogic.getText());
        assertEquals("", generateLogic.getCode());
        assertEquals("", generateLogic.getInstructions());

        generateLogic.process("");
        assertThat(generateLogic.getText(), is(not(equalTo(""))));
        assertThat(generateLogic.getCode(), is(not(equalTo(""))));
        assertThat(generateLogic.getInstructions(), is(not(equalTo(""))));
    }

    @Test
    public void testNewInstance(){
        assertEquals(GenerateLogicImpl.class, generateLogic.newInstance().getClass());
    }



}

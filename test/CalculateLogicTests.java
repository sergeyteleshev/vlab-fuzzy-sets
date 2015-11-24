import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import rlcp.PreGenerated;
import rlcp.server.logic.CalculateLogic;
import vlab.server_java.CalculateLogicImpl;

import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNot.not;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:test-java-server-config.xml")
public class CalculateLogicTests {

    @Autowired
    private CalculateLogic calculateLogic;

    @Test
    public void testProcess(){
        assertEquals("", calculateLogic.getText());
        assertEquals("", calculateLogic.getCode());

        PreGenerated preGenerated = mock(PreGenerated.class);
        when(preGenerated.getText()).thenReturn("textPreGenerated");
        when(preGenerated.getCode()).thenReturn("codePreGenerated");
        when(preGenerated.getInstructions()).thenReturn("instructionsPreGenerated");
        calculateLogic.process("condition", "instructions", preGenerated);
        assertThat(calculateLogic.getText(), is(not(equalTo(""))));
        assertThat(calculateLogic.getCode(), is(not(equalTo(""))));
    }

    @Test
    public void testNewInstance(){
        assertEquals(CalculateLogicImpl.class, calculateLogic.newInstance().getClass());
    }
}

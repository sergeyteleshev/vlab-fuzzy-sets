import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import rlcp.PreGenerated;
import rlcp.server.logic.CheckLogic;
import vlab.server_java.CheckLogicImpl;

import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:test-java-server-config.xml")
public class CheckLogicTests {
    private static final double DELTA = 1e-15;
    @Autowired
    private CheckLogic checkLogic;

    @Test
    public void testCheckSingleCondition() throws Exception {
        assertEquals("", checkLogic.getOutput());

        PreGenerated preGenerated = mock(PreGenerated.class);
        when(preGenerated.getText()).thenReturn("textPreGenerated");
        when(preGenerated.getCode()).thenReturn("codePreGenerated");
        when(preGenerated.getInstructions()).thenReturn("instructionsPreGenerated");
        float result = checkLogic.checkSingleCondition("input", "expectedOutput", "instructions", preGenerated);
        assertEquals(1, result, DELTA);
        assertThat(checkLogic.getOutput(), is(not(equalTo(""))));
        assertThat(checkLogic.getOutput(), is(equalTo("ok")));
    }


    @Test
    public void testNewInstance(){
        assertEquals(CheckLogicImpl.class, checkLogic.newInstance().getClass());
    }
}

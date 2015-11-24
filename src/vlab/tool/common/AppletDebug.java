package vlab.tool.common;

import java.awt.Dialog;
import java.awt.Frame;
import java.awt.TextArea;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

/**
 * Old class. Was not modified. Can be useful for applet debugging.
 * 
 * Class for send rlcpRequest to RLCP-server and processing response
 * 
 * @author Eugene Efimchick
 */
public class AppletDebug {

    String chooseServerIP(){
            final Dialog frm = new Dialog( new Frame() );
            frm.setModal( true );
            frm.setTitle( "Введите IP сервера" );
            //frm.setDefaultCloseOperation( JFrame.DISPOSE_ON_CLOSE );
            frm.addWindowListener( new WindowAdapter(){
            @Override
                public void windowClosing( WindowEvent e ){
                    frm.dispose();
                }
            });
            frm.setSize( 400, 150 );

            TextArea jTA = new TextArea();
            frm.add( jTA );

            frm.setVisible( true );

            return jTA.getText();
    }

    void statusCheckPost( String text ){
            final Dialog frm = new Dialog( new Frame() );
            frm.setTitle( "Ответ от сервера" );
            frm.addWindowListener( new WindowAdapter(){
            @Override
                public void windowClosing( WindowEvent e ){
                    frm.dispose();
                }
            });
            frm.setSize( 400, 300 );

            TextArea jTA = new TextArea( text );
            frm.add( jTA );

            frm.setVisible( true );
    }

	/**
	 * Метод для отправки сообщения с ответом на проверяющий сервер (минуя HTTP)
	 * @param input входной набор данных
	 * @param output эталонный выходной набор
	 * @param results ответ
	 * @param port порт, на котором запущен проверяющий сервер
	 * @return xml-сообщение от проверяющего сервера
	 */
    public String doCheckPost( String input, String output, String results, int port ){

          int    srv_port = port;
          String Ip_Port = "localhost";
          //String Ip_Port = "cde.ifmo.ru";

          try{
              String NL = "\r\n";

/*
Проверяющие наборы для лаб1: (когерентность лазерного излучения)
noice: шум
k: заданный интервал корелляции
bcount: мин. кол-во точек
blimitbottom, blimittop: минимальный предел для расстояний в ответе
noice=5;k=0.84;bcount=10;blimitbottom=-3.0;blimittop=3.0

<input><!--noice=5;k=0.84--></input>
<output><!--dummy--></output>

------------------------------------------------------
Проверяющие наборы для лаб2: (когерентность излучения некогерентного источника)
cohfuncnoice: ошибка при измерении функции когерентности (также оценивается интервал корреляции по первому заданию)
intervalnoice: ошибка при измерении интервала корелляции
cohcount: мин. кол-во точек при измерении модуля ф-ции когерентности

<input><!--cohfuncnoice=0.09;intervalnoice=0.09;cohcount=2;--></input>
<output><!--dummy--></output>
------------------------------------------------------
Проверяющие наборы для лаб3: (контраст спекл-картины)
noice: шум (допустимая ошибка)

<input><!--noice=0.05--></input>
<output><!--dummy--></output>
*/

              String req = "" +
              "<?xml version=\"1.0\" encoding=\"Windows-1251\"?>" +
              //"<!DOCTYPE Request SYSTEM \"http://de.ifmo.ru/--DTD/Request.dtd\">" +
              "<Request>" +
                  "<Conditions>" +
                      "<ConditionForChecking id=\"1\" Time=\"5\">" +
                          "<Input>" +
                            "<!-- " + input + " -->" +
                          "</Input>" +
                          "<Output>" +
                            "<!-- " + output + " -->" +
                          "</Output>" +
                      "</ConditionForChecking>" +

                      "<ConditionForChecking id=\"2\" Time=\"5\">" +
                          "<Input>" +
                            "<!-- " + input + " -->" +
                          "</Input>" +
                          "<Output>" +
                            "<!-- " + output + " -->" +
                          "</Output>" +
                      "</ConditionForChecking>" +

                  "</Conditions>"+
                  "<Instructions>"+
              "<!--";

              req += results;

              req += "-->"+
                  "</Instructions>"+
              "</Request>";
/*
              String defIp_Port = Ip_Port;
              Ip_Port = chooseServerIP();
              try{
                   srv_port = Integer.parseInt( Ip_Port.substring( Ip_Port.indexOf(":")+1 ) );
                   Ip_Port = Ip_Port.substring( 0, Ip_Port.indexOf(":") );
              }catch( Exception ipExc ){
                  Ip_Port = defIp_Port;
              }
*/
              String toSend = "check" + NL +
                      "url:rlcp://user:user@" + Ip_Port + ":" + srv_port + NL +
                      "content-length:" + req.length() + NL + NL +
                      req + NL;

              Socket s = new Socket( Ip_Port, srv_port );
              OutputStream os = s.getOutputStream();
              InputStream  is = s.getInputStream();

              os.write( toSend.getBytes() );

              int ch = 0;
              StringBuilder sb = new StringBuilder();
              while( (ch=is.read()) != -1  )
                  sb.append( (char)ch );

              s.close();

              System.out.println( "result from server:\n" + sb.toString() );

//              statusCheckPost( "Ответ от: " + Ip_Port + ":" + srv_port + "\n" + sb.toString() );

              return sb.toString();

          }catch( Exception e ){
          }
          return null;
      }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package screentask;

import java.util.Date;
import java.text.SimpleDateFormat;
import javax.swing.JTextArea;

public class Resources {

    private static final SimpleDateFormat DF = new SimpleDateFormat("dd.MM.YYYY HH:mm");

    public static void Log(JTextArea container, String value) {
        container.append(DF.format(new Date()) + " : " + value + "\r\n");
        container.setCaretPosition(container.getDocument().getLength());
    }
}

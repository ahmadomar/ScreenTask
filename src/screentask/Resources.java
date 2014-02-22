/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package screentask;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JComboBox;
import javax.swing.JTextArea;

/**
 *
 * @author Ahmad
 */
public class Resources {

    public static void Log(JTextArea container, String value) {
        container.append(Calendar.getInstance().getTime() + " : " + value + "\r\n");
        container.setCaretPosition(container.getDocument().getLength());
    }

    public static String readFileAsString(File file) throws IOException {
        StringBuilder fileData = new StringBuilder();
        BufferedReader reader = new BufferedReader(
                new FileReader(file));
        char[] buf = new char[1024];
        int numRead = 0;
        while ((numRead = reader.read(buf)) != -1) {
            String readData = String.valueOf(buf, 0, numRead);
            fileData.append(readData);
        }
        reader.close();
        return fileData.toString();
    }
    
   
    public String appStartUpPath() throws URISyntaxException, MalformedURLException{
        //return System.getProperty("user.dir");
        //return getClass().getResource("").getPath();
        String path = getClass().getProtectionDomain().getCodeSource().getLocation().getPath();
        path = path.substring(0, path.lastIndexOf(getPathDelimiter()));
        return path;
    }
    
    /**
     * Return the path delimiter
     * @return 
     */
    public static String getPathDelimiter(){
        return System.getProperty("file.separator");
    }
    
}

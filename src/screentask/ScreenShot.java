/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package screentask;

import java.awt.AWTException;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.xml.parsers.ParserConfigurationException;
import org.xml.sax.SAXException;

/**
 *
 * @author Ahmad
 */

public class ScreenShot {
    
    
    
    public static void takeScreenshot(int every,Boolean drawCursor ) throws AWTException, IOException, Exception{
        Robot robot = new Robot();
         
        /**
         * Delay the robot for 5 seconds (5000 ms) allowing you to switch to proper
         * screen/window whose screenshot is to be taken.
         *
         * You can change the delay time as required.
         */
        robot.delay(every);
        
        /**
         * Create a screen capture of the active window and then create a buffered image
         * to be saved to disk.
         */
        
        Rectangle screen = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());
        BufferedImage screenCapture = robot.createScreenCapture(screen);
        
        if(drawCursor)
            drawMousePointer(screenCapture);
        /**
         * Filename where to save the file to.
         * I am appending formatted timestamp to the filename.
         */
        
        Resources resource = new Resources();
        String startDir = resource.appStartUpPath();
       String pathDeli = Resources.getPathDelimiter();//startDir +pathDeli+
       
       //WebServerUtility wsUtility = new WebServerUtility();
       
        String fileNameToSaveTo = startDir+pathDeli+"WebServer"+pathDeli+"ScreenTask.jpg";
         
        /**
         * Write the captured image to a file.
         */
        
        ImageIO.write(screenCapture, "jpg", new File(fileNameToSaveTo));
    }
    
    private static void drawMousePointer(BufferedImage screenCapture) throws IOException, URISyntaxException{
         Point p = MouseInfo.getPointerInfo().getLocation();
          int  x = p.x;
          int  y = p.y;
          
          Resources resource = new Resources();
          String startDir = resource.appStartUpPath();
          String pathDeli = Resources.getPathDelimiter();
          
           Image cursor=null;
       
            cursor = ImageIO.read(new File(startDir+pathDeli+"WebServer"+pathDeli+"cursor_arrow.png"));
       
            Graphics graphics2D = screenCapture.createGraphics();
            graphics2D.drawImage(cursor, x, y, 25, 25, null);
    }
    
    
    public static void PreviewImage(JLabel lblImage) throws URISyntaxException, MalformedURLException{
        String imagePath = "";
        //Application startup directory
        Resources resource = new Resources();
        
        String startDir = resource.appStartUpPath();
        String pathDeli = Resources.getPathDelimiter();
        
        imagePath = startDir+pathDeli+"WebServer"+pathDeli+"ScreenTask.jpg";
       
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Image image = toolkit.getImage(imagePath);
        
        int width = lblImage.getWidth();
        int height = lblImage.getHeight();
        Image scaledImage = image.getScaledInstance(width,height, Image.SCALE_DEFAULT);   
        ImageIcon icon=new ImageIcon(scaledImage);
        
        lblImage.setIcon(icon);
    }
}

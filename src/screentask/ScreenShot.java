/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package screentask;

import java.awt.AWTException;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JLabel;

public class ScreenShot {

    private static final String BASE_PATH = System.getProperty("java.io.tmpdir");

    public void takeScreenshot(int every, Boolean drawCursor) throws AWTException, IOException, Exception {
        Robot robot = new Robot();

        /**
         * Delay the robot for 5 seconds (5000 ms) allowing you to switch to
         * proper screen/window whose screenshot is to be taken.
         *
         * You can change the delay time as required.
         */
        robot.delay(every);

        /**
         * Create a screen capture of the active window and then create a
         * buffered image to be saved to disk.
         */
        Rectangle screen = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());
        BufferedImage screenCapture = robot.createScreenCapture(screen);

        if (drawCursor) {
            drawMousePointer(screenCapture);
        }

        String fileNameToSaveTo = BASE_PATH + "/ScreenTask.jpg";
        ImageIO.write(screenCapture, "jpg", new File(fileNameToSaveTo));
    }

    private void drawMousePointer(BufferedImage screenCapture) throws IOException, URISyntaxException {
        InputStream arrow = this.getClass().getResourceAsStream("/images/cursor_arrow.png");
        Image cursor = ImageIO.read(arrow);

        Graphics graphics2D = screenCapture.createGraphics();
        Point p = MouseInfo.getPointerInfo().getLocation();
        graphics2D.drawImage(cursor, p.x, p.y, 25, 25, null);
    }

    public static void PreviewImage(JLabel lblImage) throws URISyntaxException, MalformedURLException {
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Image image = toolkit.getImage(BASE_PATH + "/ScreenTask.jpg");

        int width = lblImage.getWidth();
        int height = lblImage.getHeight();
        Image scaledImage = image.getScaledInstance(width, height, Image.SCALE_DEFAULT);
        ImageIcon icon = new ImageIcon(scaledImage);

        lblImage.setIcon(icon);
    }
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package screentask;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Ahmad
 */
public class ScreenThread extends Thread {

    private volatile boolean isRunning = true;
    private int _every;
    private boolean _mousePointer = false;
    private ScreenShot shooter = new ScreenShot();
    
    public ScreenThread(int every, boolean mousePointer) {
        _every = every;
        _mousePointer = mousePointer;
    }

    public void run() {
        while (isRunning) {
            try {
                shooter.takeScreenshot(_every, _mousePointer);
            } catch (IOException ex) {
                Logger.getLogger(ScreenThread.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(ScreenThread.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public void kill() {
        isRunning = false;
    }

    public void mousePointer(boolean mousePointer) {
        _mousePointer = mousePointer;
    }
}

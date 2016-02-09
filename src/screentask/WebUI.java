/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package screentask;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class WebUI implements HttpHandler {
    private static final String BASE_PATH = System.getProperty("java.io.tmpdir");
    private static final int BUFFER_SIZE = 5120;
    
    public void handle(HttpExchange httpExchange) throws IOException {
        String resourceBase = "/WebServer";
        String path = httpExchange.getRequestURI().getPath();
        InputStream is;

        if (path.equals("/")) { // Route The Root Dir to the Index Page
            path = "/index.html";
        }

        if (path.contains("ScreenTask")) {
            is = getTmpFile(path);
        } else {
            is = getRessource(resourceBase + path);
        }
        
        writeHttpResponse(is, httpExchange);
    }
    
    private InputStream getRessource(String ressourcePath) {
        return this.getClass().getResourceAsStream(ressourcePath);        
    }
    
    private InputStream getTmpFile(String pathName) {
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(BASE_PATH + pathName);
        } catch (FileNotFoundException ex) {
            Logger.getLogger(WebUI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return (InputStream)fis;
    }
    
    private void writeHttpResponse(InputStream input, HttpExchange httpExchange) throws IOException {
        OutputStream httpResponse = httpExchange.getResponseBody();
        
        httpExchange.sendResponseHeaders(200, 0);
        copyStream(input, httpResponse);
    }
    
    private void copyStream(InputStream is, OutputStream os) throws IOException {
        byte[] buffer = new byte[BUFFER_SIZE];
        int len;
        
        while ((len = is.read(buffer)) != -1) {
                os.write(buffer, 0, len);
        }
        
        os.close();
    }
}

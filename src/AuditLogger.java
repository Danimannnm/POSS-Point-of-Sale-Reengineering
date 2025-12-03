import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class AuditLogger {
    private String logFile = "Database/employeeLogfile.txt";
    private DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    public void logLogin(Employee employee) {
        log(employee, "logs into POS System");
    }

    public void logLogout(Employee employee) {
        log(employee, "logs out of POS System");
    }

    private void log(Employee employee, String action) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(logFile, true))) {
            String timestamp = dateFormat.format(Calendar.getInstance().getTime());
            String logEntry = String.format("%s (%s %s) %s. Time: %s", 
                employee.getName(), employee.getUsername(), employee.getPosition(), action, timestamp);
            
            writer.write(logEntry);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Error writing to log file: " + e.getMessage());
        }
    }
}

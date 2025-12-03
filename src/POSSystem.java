
import java.util.*;
import java.io.*;

public class POSSystem {
    public boolean unixOS = true; 
    public static String employeeDatabase = "Database/employeeDatabase.txt";
    public static String rentalDatabaseFile = "Database/rentalDatabase.txt"; 
    public static String itemDatabaseFile = "Database/itemDatabase.txt"; 
    
    private AuthenticationService authService;
    private AuditLogger auditLogger;

    public POSSystem() {
        // Initialize services with file-based implementations for now
        EmployeeRepository empRepo = new FileEmployeeRepository();
        auditLogger = new AuditLogger();
        authService = new AuthenticationService(empRepo, auditLogger);
    }

    // Delegated methods
    public int logIn(String username, String password) {
        return authService.login(username, password);
    }

    public void logOut(String pos) {
        authService.logout();
    }

    // Legacy temp file handling (kept for now, but should be moved to a TransactionService later)
    public boolean checkTemp() {
        String temp = "Database/temp.txt";
        File f = new File(temp);
        return f.exists() && !f.isDirectory();
    }

    public String continueFromTemp(long phone) {
        // ... (Legacy logic kept as is for now to minimize breakage during this step)
        // Ideally this should be moved to a TransactionRecoveryService
         String temp = "Database/temp.txt";
         File f=new File(temp);
    
             try{
               FileReader fileR = new FileReader(temp);
               BufferedReader textReader = new BufferedReader(fileR);
               if(f.length()==0){
                 System.out.println("The log file is not valid"); 
                 f.delete();
               }
               else{
                 String type= textReader.readLine();
                 if(type.equals("Sale")){         
                   POS sale=new POS();
                   sale.retrieveTemp(itemDatabaseFile); 
                   textReader.close();
                   return "Sale";
                 }
                 else if(type.equals("Rental")){
                   POR rental=new POR(phone);
                   rental.retrieveTemp(rentalDatabaseFile); 
                   textReader.close();
                   return "Rental";
                 }
                 
                 else if(type.equals("Return")){
                     POH returns = new POH(phone);
                     returns.retrieveTemp(rentalDatabaseFile);
                   textReader.close();
                   return "Return";
                   }
                 
               }
               textReader.close();
             }
             catch(FileNotFoundException ex) {
             }
             catch(IOException ex) {
             }
             return "";
    }
}
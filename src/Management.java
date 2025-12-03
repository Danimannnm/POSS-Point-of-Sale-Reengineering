
import java.io.*;
import java.util.*;
import java.text.*;

public class Management {
 
    private CustomerRepository customerRepository;

    public Management() {
        this.customerRepository = new FileCustomerRepository();
    }

    public Boolean checkUser(Long phone) {
        return customerRepository.exists(phone);
    }

    // getLatestReturnDate and daysBetween methods remain unchanged for now as they contain complex rental logic
    // that will be refactored in a later step or moved to a RentalService.

    public boolean createUser(Long phone) {
        customerRepository.create(phone);
        return true;
    }
 
 public static void addRental(long phone, List <Item> rentalList)
 {
  long nextPhone = 0;
  List <String> fileList = new ArrayList<String>();
  Date date = new Date();
     Format formatter = new SimpleDateFormat("MM/dd/yy");
     String dateFormat = formatter.format(date);
     boolean ableToRead = false;
  
     
     //Reads from file to read the changes to make:
  try{
     ableToRead = true;
        FileReader fileR = new FileReader(userDatabase);
        BufferedReader textReader = new BufferedReader(fileR);
        String line;
        //reads the entire database
        line = textReader.readLine(); //skips the first line, which explains how the DB is formatted. 
        fileList.add(line); //but stores it since it is the first line of the DB
        while ((line = textReader.readLine()) != null)
        {
         
          try {  
            nextPhone = Long.parseLong(line.split(" ")[0]);    
          } catch (NumberFormatException e) {  
            continue;  
          } 
          System.out.println("comparing "+ nextPhone+" == "+ phone);
          if(nextPhone == phone)//finds the user in the database
          { 
           
     //loop through each "ID" in rentalList
     for (Item item : rentalList){
      line = line + " "+ item.getItemID() + ","+dateFormat+","+"false";
     }
     
           fileList.add(line);
          }
          else
           fileList.add(line); //adds the lines that are not modified from the database to the list to be rewritten later
           
       
        }
        textReader.close();
        fileR.close();
  }
    
    //catches exceptions
      catch(FileNotFoundException ex) {
        System.out.println("cannot open userDB"); 
       
      }
      catch(IOException ex) {
        System.out.println("ioexception");
      }
  
  //Now writes to file to make the changes:
  if (ableToRead) //if file has been read throughly
  {
   try
   {
    File file = new File(userDatabase);  
    FileWriter fileR = new FileWriter(file.getAbsoluteFile());
    BufferedWriter bWriter = new BufferedWriter(fileR);
    PrintWriter writer = new PrintWriter(bWriter);
    
    for (int wCounter = 0; wCounter < fileList.size() ; ++wCounter)
     writer.println(fileList.get(wCounter));
    
    bWriter.close(); //closes writer
   }
   
   catch(IOException e){}
   {
   }
  }
  
 }
 
 
 public void updateRentalStatus(long phone, List <ReturnItem> returnedList)
 {
  long nextPhone = 0;
  List <String> fileList = new ArrayList<String>();
  String modifiedLine;
  Date date = new Date();
     Format formatter = new SimpleDateFormat("MM/dd/yy");
     String dateFormat = formatter.format(date);
     boolean ableToRead = false;
  
     
     //Reads from file to read the changes to make:

  try{
     ableToRead = true;
        FileReader fileR = new FileReader(userDatabase);
        BufferedReader textReader = new BufferedReader(fileR);
        String line;
        int returnCounter = 0;
        //reads the entire database
        line = textReader.readLine(); //skips the first line, which explains how the DB is formatted. 
        fileList.add(line); //but stores it since it is the first line of the DB
        while ((line = textReader.readLine()) != null)
        {
         
          try {  
            nextPhone = Long.parseLong(line.split(" ")[0]);    
          } catch (NumberFormatException e) {  
            continue;  
          } 
          if(nextPhone == phone)//finds the user in the database
          { 
           modifiedLine = line.split(" ")[0];
           if(line.split(" ").length >1)
           {
               
                   for(int i =1; i<line.split(" ").length; i++)
                   {
                  String returnedBool = (line.split(" ")[i]).split(",")[2];
 
                     boolean b = returnedBool.equalsIgnoreCase("true");
                     if (!b)//if item wasn't returned already
                     { 
                      for (returnCounter = 0 ; returnCounter < returnedList.size() ; returnCounter++) 
                       if (Integer.parseInt(line.split(" ")[i].split(",")[0]) == returnedList.get(returnCounter).getItemID())
                       {
                        modifiedLine += " " + line.split(" ")[i].split(",")[0] + "," + dateFormat + "," + "true";
          
                       }
                     /* if (returnCounter == returnedList.size() )
                       modifiedLine += line.split(" ")[i]; //not returning this item now*/
                     }
                   
                     
                     else
                     {
                      modifiedLine += " " + line.split(" ")[i];
                     }
                   }
           }
           fileList.add(modifiedLine);
          }
          else
           fileList.add(line); //adds the lines that are not modified from the database to the list to be rewritten later
           
       
        }
        textReader.close();
        fileR.close();
  }
    
    //catches exceptions
      catch(FileNotFoundException ex) {
        System.out.println("cannot open userDB"); 
       
      }
      catch(IOException ex) {
        System.out.println("ioexception");
      }
  
  //Now writes to file to make the changes:
  if (ableToRead) //if file has been read throughly
  {
   try
   {
    File file = new File(userDatabase);  
    FileWriter fileR = new FileWriter(file.getAbsoluteFile());
    BufferedWriter bWriter = new BufferedWriter(fileR);
    PrintWriter writer = new PrintWriter(bWriter);
    
    for (int wCounter = 0; wCounter < fileList.size() ; ++wCounter)
     writer.println(fileList.get(wCounter));
    
    bWriter.close(); //closes writer
   }
   
   catch(IOException e){}
   {
   }
  }
  

 }
 
 
 
}

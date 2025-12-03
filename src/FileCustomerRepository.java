import java.io.*;
import java.util.*;

public class FileCustomerRepository implements CustomerRepository {
    private String databaseFile = "Database/userDatabase.txt";

    @Override
    public boolean exists(long phoneNumber) {
        try (BufferedReader reader = new BufferedReader(new FileReader(databaseFile))) {
            String line = reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                try {
                    long storedPhone = Long.parseLong(line.split(" ")[0]);
                    if (storedPhone == phoneNumber) {
                        return true;
                    }
                } catch (NumberFormatException e) {
                    continue;
                }
            }
        } catch (IOException e) {
            System.err.println("Error checking customer: " + e.getMessage());
        }
        return false;
    }

    @Override
    public void create(long phoneNumber) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(databaseFile, true))) {
            writer.newLine();
            writer.write(String.valueOf(phoneNumber));
        } catch (IOException e) {
            System.err.println("Error creating customer: " + e.getMessage());
        }
    }
}

import java.util.List;
import java.io.File;

public class DataMigrator {

    public static void main(String[] args) {
        System.out.println("Starting Data Migration...");

        // 1. Initialize Database
        DatabaseManager.initializeDatabase("schema.sql");

        // 2. Migrate Employees
        migrateEmployees();

        // 3. Migrate Items
        migrateItems();

        // 4. Migrate Customers
        migrateCustomers();

        System.out.println("Data Migration Completed.");
    }

    private static void migrateEmployees() {
        System.out.println("Migrating Employees...");
        EmployeeRepository fileRepo = new FileEmployeeRepository();
        EmployeeRepository dbRepo = new SqliteEmployeeRepository();

        List<Employee> employees = fileRepo.findAll();
        for (Employee emp : employees) {
            dbRepo.save(emp);
            System.out.println("Migrated employee: " + emp.getUsername());
        }
    }

    private static void migrateItems() {
        System.out.println("Migrating Items...");
        // Assuming the file path is standard
        ItemRepository fileRepo = new FileItemRepository("Database/itemDatabase.txt");
        ItemRepository dbRepo = new SqliteItemRepository();

        List<Item> items = fileRepo.findAll();
        for (Item item : items) {
            dbRepo.save(item);
            System.out.println("Migrated item: " + item.getItemID());
        }
    }

    private static void migrateCustomers() {
        System.out.println("Migrating Customers...");
        CustomerRepository fileRepo = new FileCustomerRepository();
        CustomerRepository dbRepo = new SqliteCustomerRepository();
        
        // FileCustomerRepository doesn't have a findAll() because the interface didn't need it before.
        // We need to cheat a bit here and read the file directly or cast/extend the repo.
        // For simplicity, let's just read the file here since this is a one-off migration script.
        
        String userDatabase = "Database/userDatabase.txt";
        try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(userDatabase))) {
            String line = reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                try {
                    long phone = Long.parseLong(line.split(" ")[0]);
                    dbRepo.create(phone);
                    System.out.println("Migrated customer: " + phone);
                } catch (NumberFormatException e) {
                    continue;
                }
            }
        } catch (java.io.IOException e) {
            System.err.println("Error reading userDatabase.txt: " + e.getMessage());
        }
    }
}

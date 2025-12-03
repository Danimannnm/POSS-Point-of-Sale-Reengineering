import java.io.*;
import java.util.*;

public class FileEmployeeRepository implements EmployeeRepository {
    private String databaseFile = "Database/employeeDatabase.txt";
    private List<Employee> employees = new ArrayList<>();

    public FileEmployeeRepository() {
        load();
    }

    private void load() {
        employees.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(databaseFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(" ");
                if (parts.length >= 5) {
                    String name = parts[2] + " " + parts[3];
                    employees.add(new Employee(parts[0], name, parts[1], parts[4]));
                }
            }
        } catch (IOException e) {
            System.err.println("Error loading employees: " + e.getMessage());
        }
    }

    private void saveAll() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(databaseFile))) {
            for (Employee emp : employees) {
                // Format: ID Position FirstName LastName Password
                String[] nameParts = emp.getName().split(" ");
                String firstName = nameParts.length > 0 ? nameParts[0] : "";
                String lastName = nameParts.length > 1 ? nameParts[1] : "";
                
                String line = emp.getUsername() + " " + emp.getPosition() + " " + firstName + " " + lastName + " " + emp.getPassword();
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error saving employees: " + e.getMessage());
        }
    }

    @Override
    public List<Employee> findAll() {
        return new ArrayList<>(employees);
    }

    @Override
    public Employee findById(String id) {
        return employees.stream()
                .filter(e -> e.getUsername().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public Employee findByUsername(String username) {
        return findById(username);
    }

    @Override
    public void save(Employee entity) {
        Employee existing = findById(entity.getUsername());
        if (existing != null) {
            employees.remove(existing);
        }
        employees.add(entity);
        saveAll();
    }

    @Override
    public void delete(String id) {
        Employee existing = findById(id);
        if (existing != null) {
            employees.remove(existing);
            saveAll();
        }
    }
}

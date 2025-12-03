import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SqliteEmployeeRepository implements EmployeeRepository {

    @Override
    public List<Employee> findAll() {
        List<Employee> employees = new ArrayList<>();
        String sql = "SELECT * FROM employees";
        
        try (Connection conn = DatabaseManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                String name = rs.getString("first_name") + " " + rs.getString("last_name");
                employees.add(new Employee(
                    rs.getString("username"),
                    name,
                    rs.getString("role"),
                    rs.getString("password")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Error finding all employees: " + e.getMessage());
        }
        return employees;
    }

    @Override
    public Employee findById(String id) {
        return findByUsername(id);
    }

    @Override
    public Employee findByUsername(String username) {
        String sql = "SELECT * FROM employees WHERE username = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                String name = rs.getString("first_name") + " " + rs.getString("last_name");
                return new Employee(
                    rs.getString("username"),
                    name,
                    rs.getString("role"),
                    rs.getString("password")
                );
            }
        } catch (SQLException e) {
            System.err.println("Error finding employee by username: " + e.getMessage());
        }
        return null;
    }

    @Override
    public void save(Employee entity) {
        // Upsert logic (Insert or Update)
        // Since SQLite doesn't have a simple UPSERT in older versions, we'll try update then insert, or check existence.
        // Using INSERT OR REPLACE is a common SQLite idiom for this if the primary key matches.
        // However, our primary key is 'id' (auto-inc), but 'username' is UNIQUE.
        
        String sql = "INSERT OR REPLACE INTO employees (username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)";
        
        // We need to handle the ID mapping if we want to preserve it, but for now we rely on username uniqueness.
        // Actually, if we want to update an existing user by username, we should check if they exist.
        
        Employee existing = findByUsername(entity.getUsername());
        if (existing != null) {
            // Update
             String updateSql = "UPDATE employees SET password = ?, first_name = ?, last_name = ?, role = ? WHERE username = ?";
             try (Connection conn = DatabaseManager.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(updateSql)) {
                
                String[] nameParts = entity.getName().split(" ");
                String firstName = nameParts.length > 0 ? nameParts[0] : "";
                String lastName = nameParts.length > 1 ? nameParts[1] : "";

                pstmt.setString(1, entity.getPassword());
                pstmt.setString(2, firstName);
                pstmt.setString(3, lastName);
                pstmt.setString(4, entity.getPosition());
                pstmt.setString(5, entity.getUsername());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                System.err.println("Error updating employee: " + e.getMessage());
            }
        } else {
            // Insert
             String insertSql = "INSERT INTO employees (username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)";
             try (Connection conn = DatabaseManager.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                
                String[] nameParts = entity.getName().split(" ");
                String firstName = nameParts.length > 0 ? nameParts[0] : "";
                String lastName = nameParts.length > 1 ? nameParts[1] : "";

                pstmt.setString(1, entity.getUsername());
                pstmt.setString(2, entity.getPassword());
                pstmt.setString(3, firstName);
                pstmt.setString(4, lastName);
                pstmt.setString(5, entity.getPosition());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                System.err.println("Error inserting employee: " + e.getMessage());
            }
        }
    }

    @Override
    public void delete(String id) {
        String sql = "DELETE FROM employees WHERE username = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error deleting employee: " + e.getMessage());
        }
    }
}

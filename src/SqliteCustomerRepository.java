import java.sql.*;

public class SqliteCustomerRepository implements CustomerRepository {

    @Override
    public boolean exists(long phoneNumber) {
        String sql = "SELECT 1 FROM customers WHERE phone_number = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, phoneNumber);
            ResultSet rs = pstmt.executeQuery();
            return rs.next();
            
        } catch (SQLException e) {
            System.err.println("Error checking customer existence: " + e.getMessage());
        }
        return false;
    }

    @Override
    public void create(long phoneNumber) {
        String sql = "INSERT OR IGNORE INTO customers (phone_number) VALUES (?)";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setLong(1, phoneNumber);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            System.err.println("Error creating customer: " + e.getMessage());
        }
    }
}

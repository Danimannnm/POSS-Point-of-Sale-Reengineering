import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SqliteItemRepository implements ItemRepository {

    @Override
    public List<Item> findAll() {
        List<Item> items = new ArrayList<>();
        String sql = "SELECT * FROM items";
        
        try (Connection conn = DatabaseManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                items.add(new Item(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getFloat("price"),
                    rs.getInt("quantity")
                ));
            }
        } catch (SQLException e) {
            System.err.println("Error finding all items: " + e.getMessage());
        }
        return items;
    }

    @Override
    public Item findById(Integer id) {
        String sql = "SELECT * FROM items WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return new Item(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getFloat("price"),
                    rs.getInt("quantity")
                );
            }
        } catch (SQLException e) {
            System.err.println("Error finding item by id: " + e.getMessage());
        }
        return null;
    }

    @Override
    public void save(Item entity) {
        // Check if exists
        Item existing = findById(entity.getItemID());
        if (existing != null) {
            // Update
            String sql = "UPDATE items SET name = ?, price = ?, quantity = ? WHERE id = ?";
            try (Connection conn = DatabaseManager.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, entity.getItemName());
                pstmt.setDouble(2, entity.getPrice());
                pstmt.setInt(3, entity.getAmount());
                pstmt.setInt(4, entity.getItemID());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                System.err.println("Error updating item: " + e.getMessage());
            }
        } else {
            // Insert
            String sql = "INSERT INTO items (id, name, price, quantity) VALUES (?, ?, ?, ?)";
            try (Connection conn = DatabaseManager.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setInt(1, entity.getItemID());
                pstmt.setString(2, entity.getItemName());
                pstmt.setDouble(3, entity.getPrice());
                pstmt.setInt(4, entity.getAmount());
                pstmt.executeUpdate();
            } catch (SQLException e) {
                System.err.println("Error inserting item: " + e.getMessage());
            }
        }
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM items WHERE id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error deleting item: " + e.getMessage());
        }
    }
}

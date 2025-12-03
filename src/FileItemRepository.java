import java.io.*;
import java.util.*;

public class FileItemRepository implements ItemRepository {
    private String databaseFile;
    private List<Item> items = new ArrayList<>();

    public FileItemRepository(String databaseFile) {
        this.databaseFile = databaseFile;
        load();
    }

    private void load() {
        items.clear();
        try (BufferedReader reader = new BufferedReader(new FileReader(databaseFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(" ");
                if (parts.length >= 4) {
                    items.add(new Item(
                        Integer.parseInt(parts[0]),
                        parts[1],
                        Float.parseFloat(parts[2]),
                        Integer.parseInt(parts[3])
                    ));
                }
            }
        } catch (IOException e) {
            System.err.println("Error loading items from " + databaseFile + ": " + e.getMessage());
        }
    }

    private void saveAll() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(databaseFile))) {
            for (Item item : items) {
                String line = item.getItemID() + " " + item.getItemName() + " " + item.getPrice() + " " + item.getAmount();
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error saving items to " + databaseFile + ": " + e.getMessage());
        }
    }

    @Override
    public List<Item> findAll() {
        return new ArrayList<>(items);
    }

    @Override
    public Item findById(Integer id) {
        return items.stream()
                .filter(i -> i.getItemID() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public void save(Item entity) {
        Item existing = findById(entity.getItemID());
        if (existing != null) {
            items.remove(existing);
        }
        items.add(entity);
        saveAll();
    }

    @Override
    public void delete(Integer id) {
        Item existing = findById(id);
        if (existing != null) {
            items.remove(existing);
            saveAll();
        }
    }
}

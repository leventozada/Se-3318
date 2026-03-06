package com.example.todo;

import java.sql.*;
import java.io.File;

public class DatabaseConnection {
    private static final String DB_PATH = System.getProperty("java.io.tmpdir") + File.separator + "todo.db";
    
    static {
        initializeDatabase();
    }
    
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + DB_PATH);
    }
    
    private static void initializeDatabase() {
        try {
            Class.forName("org.sqlite.JDBC");
            try (Connection conn = getConnection()) {
                String sql = "CREATE TABLE IF NOT EXISTS tasks (" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "title TEXT NOT NULL," +
                        "completed BOOLEAN DEFAULT 0," +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                        "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")";
                
                try (Statement stmt = conn.createStatement()) {
                    stmt.execute(sql);
                    System.out.println("Database initialized successfully!");
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
}

package com.example.todo;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import com.google.gson.Gson;

public class TaskServlet extends HttpServlet {
    private TaskDAO taskDAO = new TaskDAO();
    private Gson gson = new Gson();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        
        try {
            if (action == null || "list".equals(action)) {
                List<Task> tasks = taskDAO.getAllTasks();
                out.print(gson.toJson(tasks));
            } else if ("get".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                Task task = taskDAO.getTaskById(id);
                out.print(gson.toJson(task));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Error: " + e.getMessage())));
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        
        try {
            if ("add".equals(action)) {
                String title = request.getParameter("title");
                if (title == null || title.trim().isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.print(gson.toJson(new ErrorResponse("Title cannot be empty")));
                    return;
                }
                
                int id = taskDAO.addTask(title.trim());
                if (id > 0) {
                    Task task = taskDAO.getTaskById(id);
                    out.print(gson.toJson(task));
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print(gson.toJson(new ErrorResponse("Failed to add task")));
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Error: " + e.getMessage())));
        }
    }
    
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        
        try {
            if ("toggle".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                boolean success = taskDAO.toggleTaskStatus(id);
                if (success) {
                    Task task = taskDAO.getTaskById(id);
                    out.print(gson.toJson(task));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print(gson.toJson(new ErrorResponse("Task not found")));
                }
            } else if ("update".equals(action)) {
                int id = Integer.parseInt(request.getParameter("id"));
                String title = request.getParameter("title");
                boolean completed = Boolean.parseBoolean(request.getParameter("completed"));
                
                if (title == null || title.trim().isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.print(gson.toJson(new ErrorResponse("Title cannot be empty")));
                    return;
                }
                
                boolean success = taskDAO.updateTask(id, title.trim(), completed);
                if (success) {
                    Task task = taskDAO.getTaskById(id);
                    out.print(gson.toJson(task));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print(gson.toJson(new ErrorResponse("Task not found")));
                }
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Error: " + e.getMessage())));
        }
    }
    
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        try {
            int id = Integer.parseInt(request.getParameter("id"));
            boolean success = taskDAO.deleteTask(id);
            
            if (success) {
                out.print(gson.toJson(new SuccessResponse("Task deleted successfully")));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(new ErrorResponse("Task not found")));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Error: " + e.getMessage())));
        }
    }
    
    static class ErrorResponse {
        String error;
        ErrorResponse(String error) { this.error = error; }
    }
    
    static class SuccessResponse {
        String message;
        SuccessResponse(String message) { this.message = message; }
    }
}

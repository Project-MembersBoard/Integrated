package com.project.spring.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class Comment {
    private int id;
    private int boardId;
    private String userId;
    private String content;
    private LocalDateTime created;
    private LocalDateTime updated;
    private Integer parentId;
    private List<Comment> replies;
    
    // 추가 필드 - 작성자 이름을 위해 (JOIN 결과를 담기 위함)
    private String userName;
    
    public Comment() {}
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getBoardId() {
        return boardId;
    }
    
    public void setBoardId(int boardId) {
        this.boardId = boardId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getCreated() {
        return created;
    }
    
    public void setCreated(LocalDateTime created) {
        this.created = created;
    }
    
    public LocalDateTime getUpdated() {
        return updated;
    }
    
    public void setUpdated(LocalDateTime updated) {
        this.updated = updated;
    }
    
    public Integer getParentId() {
        return parentId;
    }
    
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }
    
    public List<Comment> getReplies() {
        return replies;
    }
    
    public void setReplies(List<Comment> replies) {
        this.replies = replies;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
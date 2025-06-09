package com.project.spring.DTO;

import java.time.LocalDateTime;

public class Board {
    private int id;
    private String title;
    private String content;
    private String writer;
    private String category;
    private String tag;
    private int hit;
    private int liked;
    private LocalDateTime created;
    private LocalDateTime updated;
    private String image;

    
    
//    public static class ReplacementDTO {
//        private String badWord;
//        private String replacement;
//
//        public Replacement() {}
//
//        public Replacement(String badWord, String replacement) {
//            this.badWord = badWord;
//            this.replacement = replacement;
//        }
//
//        public String getBadWord() {
//            return badWord;
//        }
//
//        public void setBadWord(String badWord) {
//            this.badWord = badWord;
//        }
//
//        public String getReplacement() {
//            return replacement;
//        }
//
//        public void setReplacement(String replacement) {
//            this.replacement = replacement;
//        }
//    }
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getWriter() {
        return writer;
    }
    
    public void setWriter(String writer) {
        this.writer = writer;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getTag() {
        return tag;
    }
    
    public void setTag(String tag) {
        this.tag = tag;
    }
    
    public int getliked() {
        return liked;
    }
    
    public void setliked(int liked) {
        this.liked = liked;
    }
    
    public int getHit() {
        return hit;
    }
    
    public void setHit(int hit) {
        this.hit = hit;
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

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}
}
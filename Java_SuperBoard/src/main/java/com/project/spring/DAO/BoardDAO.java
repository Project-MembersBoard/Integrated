package com.project.spring.DAO;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.Board;
import com.project.spring.DTO.ReplacementDTO;

@Mapper
public interface BoardDAO {
    
	
	
	
    // Existing methods
    public List<Board> selectAll();
    public Board selectById(int id);
    public void insert(Board board);
    public void updateHit(int id);
    public void update(Board board);
    public void delete(int id);
    
    // Category methods
    public List<Map<String, Object>> selectAllCategories();
    public void insertCategory(String name);
    public void deleteCategory(int id);
    
    // Like methods
    public boolean checkLike(@Param("boardId") int boardId, @Param("userId") String userId);
    public void insertLike(@Param("boardId") int boardId, @Param("userId") String userId);
    public void deleteLike(@Param("boardId") int boardId, @Param("userId") String userId);
    public int getLikeCount(int boardId);
    public void updateLikeCount(@Param("boardId") int boardId, @Param("likeCount") int likeCount);                      //2
   
    // Default method to toggle like (can be implemented in service layer if needed)
    default boolean toggleLike(int boardId, String userId) {
        boolean hasLiked = checkLike(boardId, userId);
       
        if (hasLiked) {
            deleteLike(boardId, userId);
        } else {
            insertLike(boardId, userId);
        }
       
        // Update like count in board table
        int likeCount = getLikeCount(boardId);                             //3
        updateLikeCount(boardId, likeCount);
       
        return !hasLiked; // Return new like status
    }     
    
    // Statistics methods
    public List<Map<String, Object>> getTimeStatistics(String period);
    public List<Board> getPopularPosts();
    public List<Map<String, Object>> getTopAuthors();
    
    // 🔽 욕설 필터링 관련 추가 메서드들
    public List<String> getBannedWords();
    public List<String> getBannedPatterns();
    public List<ReplacementDTO> getBannedReplacements();
	public List<Board> selectWithParams(Map<String, Object> params);
}
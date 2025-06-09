package com.project.spring.DAO;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.spring.DTO.Comment;

@Mapper
public interface CommentDAO {
	// 게시글별 총 댓글 수 (댓글 + 답글) 조회
	int countByBoardId(int boardId);
	
    // 특정 게시글의 모든 댓글 조회 (부모 댓글만)
    public List<Comment> selectByBoardId(int boardId);
    
    // 특정 댓글의 답글 조회
    public List<Comment> selectRepliesByParentId(int parentId);
    
    // 댓글 하나 조회
    public Comment selectById(int id);
    
    // 댓글 추가
    public void insert(Comment comment);
    
    // 답글 추가
    public void insertReply(@Param("comment") Comment comment, @Param("parentId") int parentId);
    
    // 댓글 수정
    public void update(Comment comment);
    
    // 댓글 삭제
    public void delete(int id);
    
    // 특정 게시글의 댓글 계층 구조로 조회 (부모 댓글과 그에 딸린 답글들)
    public List<Comment> selectCommentsWithReplies(int boardId);
}
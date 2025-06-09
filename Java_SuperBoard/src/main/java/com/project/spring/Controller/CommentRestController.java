package com.project.spring.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.CommentDAO;
import com.project.spring.DTO.Comment;


import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true")
@RestController
@RequestMapping("/api/comments")
public class CommentRestController {
    
    @Autowired
    private CommentDAO commentDAO;
    
    // 댓글 답글 총 숫자 카운트
    @GetMapping("/board/{boardId}/count")
    public ResponseEntity<?> getCommentCount(@PathVariable("boardId") int boardId) {
        try {
            int totalCount = commentDAO.countByBoardId(boardId);
            Map<String, Integer> response = new HashMap<>();
            response.put("totalCount", totalCount);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("댓글 수 조회 중 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 특정 게시글의 모든 댓글 조회
    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> getCommentsByBoardId(@PathVariable("boardId") int boardId) {
        try {
            // 계층형으로 댓글과 답글을 한번에 조회
            List<Comment> comments = commentDAO.selectCommentsWithReplies(boardId);
            return new ResponseEntity<>(comments, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("댓글을 불러오는 중 오류가 발생했습니다: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 새 댓글 작성
    @PostMapping("/board/{boardId}")
    public ResponseEntity<?> addComment(@PathVariable("boardId") int boardId, 
                                        @RequestBody Comment comment,
                                        HttpSession session) {
        
        String userId = (String) session.getAttribute("WhoLogin");
        if (userId == null) {
            return new ResponseEntity<>("로그인이 필요합니다", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            // 비속어 필터링 적용 (게시글과 동일한 필터 서비스 사용)
            String content = comment.getContent();
            
            comment.setBoardId(boardId);
            comment.setUserId(userId);
            comment.setParentId(null); // 새 댓글은 부모가 없음
            
            commentDAO.insert(comment);
            
            // 방금 추가한 댓글 정보 조회 (작성자 이름 포함)
            Comment newComment = commentDAO.selectById(comment.getId());
            
            return new ResponseEntity<>(newComment, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("댓글 작성 중 오류가 발생했습니다: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 답글 작성
    @PostMapping("/{commentId}/reply")
    public ResponseEntity<?> addReply(@PathVariable("commentId") int commentId,
                                      @RequestBody Comment reply,
                                      HttpSession session) {
    	
        
        String userId = (String) session.getAttribute("WhoLogin");
        if (userId == null) {
            return new ResponseEntity<>("로그인이 필요합니다", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            // 원 댓글 조회
            Comment parentComment = commentDAO.selectById(commentId);
            System.out.println("=== parentComment ===");
            System.out.println("ID: " + parentComment.getId());
            System.out.println("UserID: " + parentComment.getUserId());
            System.out.println("BoardID: " + parentComment.getBoardId());  
            System.out.println("Content: " + parentComment.getContent());
            if (parentComment == null) {
                return new ResponseEntity<>("원 댓글을 찾을 수 없습니다", HttpStatus.NOT_FOUND);
            }
            
            // 답글 정보 설정
            reply.setBoardId(parentComment.getBoardId());
            reply.setUserId(userId);
            reply.setParentId(commentId);
            
            commentDAO.insert(reply);
            
            // 방금 추가한 답글 정보 조회
            Comment newReply = commentDAO.selectById(reply.getId());
            
            return new ResponseEntity<>(newReply, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("답글 작성 중 오류가 발생했습니다: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable("commentId") int commentId,
                                          @RequestBody Comment comment,
                                          HttpSession session) {
        
        String userId = (String) session.getAttribute("WhoLogin");
        if (userId == null) {
            return new ResponseEntity<>("로그인이 필요합니다", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            Comment existingComment = commentDAO.selectById(commentId);
            if (existingComment == null) {
                return new ResponseEntity<>("댓글을 찾을 수 없습니다", HttpStatus.NOT_FOUND);
            }
            
            // 작성자 본인 또는 관리자만 수정 가능
            if (!existingComment.getUserId().equals(userId) && !userId.equals("admin")) {
                return new ResponseEntity<>("본인이 작성한 댓글만 수정할 수 있습니다", HttpStatus.FORBIDDEN);
            }
            
            comment.setId(commentId);
            comment.setUserId(existingComment.getUserId()); // 원래 작성자 유지
            
            commentDAO.update(comment);
            
            // 수정된 댓글 정보 조회
            Comment updatedComment = commentDAO.selectById(commentId);
            
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("댓글 수정 중 오류가 발생했습니다: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") int commentId,
                                          HttpSession session) {
        
        String userId = (String) session.getAttribute("WhoLogin");
        if (userId == null) {
            return new ResponseEntity<>("로그인이 필요합니다", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            Comment existingComment = commentDAO.selectById(commentId);
            if (existingComment == null) {
                return new ResponseEntity<>("댓글을 찾을 수 없습니다", HttpStatus.NOT_FOUND);
            }
            
            // 작성자 본인 또는 관리자만 삭제 가능
            if (!existingComment.getUserId().equals(userId) && !userId.equals("admin")) {
                return new ResponseEntity<>("본인이 작성한 댓글만 삭제할 수 있습니다", HttpStatus.FORBIDDEN);
            }
            
            commentDAO.delete(commentId);
            
            return new ResponseEntity<>("댓글이 삭제되었습니다", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("댓글 삭제 중 오류가 발생했습니다: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
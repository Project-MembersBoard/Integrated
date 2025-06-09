package com.project.spring.Controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.spring.DAO.BoardDAO;
import com.project.spring.DTO.Board;
import com.project.spring.Service.FilterService;


import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins="http://localhost:3000", allowCredentials="true")
@RestController
@RequestMapping("/api/board")
public class BoardRestController {
    
    @Autowired
    private BoardDAO bdao;
    
    @GetMapping("/list")
    public ResponseEntity<?> boardList(
           @RequestParam(name = "category", required = false) String category,
              @RequestParam(name = "order", required = false) String order,
              @RequestParam(name = "limit", required = false) Integer limit
    ) {
        try {
            List<Board> blist;

            // 파라미터가 아무것도 없으면 전체 조회
            if (category == null && order == null && limit == null) {
                blist = bdao.selectAll();
            } else {
                // 파라미터 중 하나라도 있으면 조건 조회
                Map<String, Object> params = new HashMap<>();
                if (category != null) params.put("category", category);
                if (order != null) params.put("order", order);
                params.put("limit", limit != null ? limit : 5); // limit이 null이면 5로 기본값 설정

                blist = bdao.selectWithParams(params);
            }

            return new ResponseEntity<>(blist, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error fetching board list: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(HttpSession sess) {
        try {
            List<Map<String, Object>> categories = bdao.selectAllCategories();
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error fetching categories: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> payload, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            String categoryName = payload.get("name");
            if(categoryName == null || categoryName.trim().isEmpty()) {
                return new ResponseEntity<>("Category name is required", HttpStatus.BAD_REQUEST);
            }
            
            bdao.insertCategory(categoryName);
            return new ResponseEntity<>("Category created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating category: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") int id, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            bdao.deleteCategory(id);
            return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting category: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
//    @PostMapping("/like/{id}")
//    public ResponseEntity<?> likeBoard(@PathVariable("id") int id, HttpSession sess) {
//        String userid = (String) sess.getAttribute("WhoLogin");
//        if(userid == null) {
//            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
//        }
//        
//        try {
//            // 좋아요 상태를 토글 (insert or delete)
//            if (bdao.checkLike(id, userid)) {
//                bdao.deleteLike(id, userid);
//            } else {
//                bdao.insertLike(id, userid);
//            }
//
//            // 좋아요 수 조회
//            int totalLikes = bdao.getLikeCount(id);
//            boolean liked = bdao.checkLike(id, userid);
//
//            Map<String, Object> result = new HashMap<>();
//            result.put("liked", liked);
//            result.put("totalLikes", totalLikes);
//
//            return new ResponseEntity<>(result, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>("Error processing like: " + e.getMessage(),
//                                        HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    @PostMapping("/like/{id}")
    public ResponseEntity<?> likeBoard(@PathVariable("id") int id, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
       
        try {
            // 좋아요 상태를 토글 (insert or delete)
            if (bdao.checkLike(id, userid)) {
                bdao.deleteLike(id, userid);
            } else {
                bdao.insertLike(id, userid);
            }

            // 좋아요 수 조회
            int totalLikes = bdao.getLikeCount(id);
            boolean liked = bdao.checkLike(id, userid);
           
            bdao.updateLikeCount(id, totalLikes);  //추가한것


            Map<String, Object> result = new HashMap<>();
            result.put("liked", liked);
            result.put("totalLikes", totalLikes);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing like: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/likeCount/{id}")
    public ResponseEntity<Map<String, Integer>> getLikeCount(@PathVariable("id") int id) {
        int count = bdao.getLikeCount(id);
        Map<String, Integer> result = new HashMap<>();
        result.put("count", count);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/checkLike/{id}")
    public ResponseEntity<?> checkLike(@PathVariable("id") int id, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            boolean liked = bdao.checkLike(id, userid);
            
            Map<String, Object> result = new HashMap<>();
            result.put("liked", liked);
            return new ResponseEntity<>(result, HttpStatus.OK);

        } catch (Exception e) {
        	e.printStackTrace();
            return new ResponseEntity<>("Error checking like status: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Statistics endpoints for admin
    @GetMapping("/statistics/time")
    public ResponseEntity<?> getTimeStatistics(@RequestParam("period") String period, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            List<Map<String, Object>> stats = bdao.getTimeStatistics(period);
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching time statistics: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/statistics/popular")
    public ResponseEntity<?> getPopularPosts(HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            List<Board> popularPosts = bdao.getPopularPosts();
            return new ResponseEntity<>(popularPosts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching popular posts: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/statistics/authors")
    public ResponseEntity<?> getTopAuthors(HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            List<Map<String, Object>> topAuthors = bdao.getTopAuthors();
            return new ResponseEntity<>(topAuthors, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching top authors: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewBoard(@PathVariable("id") int id, HttpSession sess) {
        try {
            // 게시글 조회
            Board board = bdao.selectById(id);
            if (board == null) {
                return new ResponseEntity<>("Board not found", HttpStatus.NOT_FOUND);
            }
            
            // 조회수 증가
            bdao.updateHit(id);
            
            return new ResponseEntity<>(board, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error viewing board: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/write")
    public ResponseEntity<?> writeBoard(@RequestBody Board board, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if (userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        try {
            String content = board.getContent();

            // 1. 금지어 포함 여부 확인
            if (FilterService.containsBanned(content, bdao)) {
                return ResponseEntity.badRequest().body("비속어 또는 금지 패턴이 포함되어 있습니다.");
            }

            // 2. 자동 치환 후 저장
            String cleanedContent = FilterService.autoReplace(content, bdao);
            board.setContent(cleanedContent);
            board.setWriter(userid);

            // 3. DB에 저장
            bdao.insert(board);

            return new ResponseEntity<>("Board created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating board: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateBoard(@PathVariable("id") int id, @RequestBody Board board, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            Board existing = bdao.selectById(id);
            if (existing == null) {
                return new ResponseEntity<>("Board not found", HttpStatus.NOT_FOUND);
            }
            
            // Check if current user is the author
            if (!existing.getWriter().equals(userid)) {
                return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
            }
            
            board.setId(id);
            board.setWriter(userid);
            bdao.update(board);
            
            return new ResponseEntity<>("Board updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating board: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable("id") int id, HttpSession sess) {
        String userid = (String) sess.getAttribute("WhoLogin");
        if(userid == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            Board existing = bdao.selectById(id);
            if (existing == null) {
                return new ResponseEntity<>("Board not found", HttpStatus.NOT_FOUND);
            }
            
            // Check if current user is the author or admin
            if (!existing.getWriter().equals(userid) && !userid.equals("admin")) {
                return new ResponseEntity<>("Forbidden", HttpStatus.FORBIDDEN);
            }
            
            // If the user is admin, change the title and content
            if (userid.equals("admin")) {
                existing.setTitle("관리자에 의해 삭제 된 글입니다.");
                existing.setContent("");  // 빈 문자열로 설정
                bdao.update(existing);  // 업데이트된 내용을 데이터베이스에 반영
            } else {
                // 일반 사용자는 본인의 글만 삭제 가능
                bdao.delete(id);
            }
            
            return new ResponseEntity<>("Board deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting board: " + e.getMessage(),
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
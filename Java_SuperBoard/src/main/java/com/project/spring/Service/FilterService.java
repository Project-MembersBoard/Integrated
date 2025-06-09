package com.project.spring.Service;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.spring.DAO.BoardDAO;
import com.project.spring.DTO.ReplacementDTO;

@Service
public class FilterService {

    @Autowired
    private BoardDAO boardDAO;

 // 금지어 포함 여부 확인 (static으로 변경)
    public static boolean containsBanned(String content, BoardDAO boardDAO) {
        List<String> bannedWords = boardDAO.getBannedWords();
        List<String> bannedPatterns = boardDAO.getBannedPatterns();

        for (String word : bannedWords) {
            if (content.contains(word)) {
                return true;
            }
        }

        for (String pattern : bannedPatterns) {
            if (Pattern.compile(pattern).matcher(content).find()) {
                return true;
            }
        }

        return false;
    }

    // 자동 치환 기능 (static으로 변경)
    public static String autoReplace(String content, BoardDAO boardDAO) {
        List<ReplacementDTO> replacements = boardDAO.getBannedReplacements();

        for (ReplacementDTO r : replacements) {
            content = content.replaceAll(r.getBadWord(), r.getReplacement());
        }

        return content;
    }
}
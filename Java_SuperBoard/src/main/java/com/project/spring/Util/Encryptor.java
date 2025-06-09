package com.project.spring.Util;

public class Encryptor {
	
	// 비밀번호 암호화
	public static String customEncrypt(String input, int shift) {
		
	    StringBuilder encryptedString = new StringBuilder();
	        
	    for (char c : input.toCharArray()) {
	        if (Character.isLetter(c)) {
	            char base = Character.isLowerCase(c) ? 'a' : 'A';
	            char shiftedChar1 = (char) ((c - base + shift) % 26 + base);
	            char shiftedChar2 = (char) ((c - base + shift + 5) % 26 + base); // 추가로 5 더해서 다른 문자로 변환
	            encryptedString.append(shiftedChar1).append(shiftedChar2);
	        } else {
	            encryptedString.append(c).append(c); // 문자가 아니면 동일한 문자 두 번 추가
	        }
	    }
	    
	    return encryptedString.toString();
	};
	
	// 복호화
	public static String customDecrypt(String input, int shift) {
		
		shift = shift % 26;
		
	    StringBuilder decryptedString = new StringBuilder();
	    
	    for (int i = 0; i < input.length(); i += 2) {
	        char c1 = input.charAt(i);
	        char c2 = input.charAt(i + 1);

	        if (Character.isLetter(c1) && Character.isLetter(c2)) {
	            char base1 = Character.isLowerCase(c1) ? 'a' : 'A';
	            char originalChar = (char) ((c1 - base1 - shift + 26) % 26 + base1);
	            decryptedString.append(originalChar);
	        } else if (c1 == c2) {  // 문자나 숫자가 그대로 두 번 저장된 경우
		            decryptedString.append(c1);
		        }
		    }
		    
		    return decryptedString.toString();
		};

}

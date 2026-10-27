class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Sliding Window
        window = set() # Store letters
        left = 0
        max_window = 0

        for right in range(len(s)):
            # Remove left chars if current char is present in window 
            while s[right] in window:
                window.remove(s[left])
                left+=1
            window.add(s[right]) 
            max_window = max(max_window, right-left+1)
        return max_window

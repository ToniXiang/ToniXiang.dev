## 基本概念
Hash 可以把本來搜尋需要遍歷陣列變成可 O(1) 找到。例如：成績用名字去查，而不是從頭找一遍。
90% 的計算機問題本質就是：
- 查找
- 計數
- 判斷是否存在
- 儲存狀態
## 實作
```cpp
unordered_map<Key, Value> mp;  // 鍵值對映射
unordered_set<Key> st;         // 唯一值集合
```
### 計數地圖
```cpp
unordered_map<int, int> mp;
for (int x : nums) {
    mp[x]++;
}
```
### 判斷是否出現過
```cpp
unordered_set<int> st;
if (st.count(x)) {
    // 出現過
}
st.insert(x);
```
### 字符頻率統計
常用於字串問題：
```cpp
vector<int> cnt(26, 0);   
for (char c : s) {
    cnt[c - 'a']++;
}
```
### 雙 key 處理
處理二維座標或配對：
```cpp
typedef long long ll;
unordered_map<ll, int> mp;
ll key = (ll)x << 32 | y;  // 結合兩個 int
mp[key]++;
```
## 實戰應用
常見題型：
- Two Sum → 找兩數之和
- 字串異位詞 → 字符頻率統計
- 最長不重複子串 → 滑動窗口配合 Hash
- 群組異位詞 → 排序後作為 key

注意事項：
- Hash 表不保證順序
- 最壞情況可能退化為 O(N)
- 空間換時間的典型例子
- 極端的情況下被卡 TLE 不是你錯，hash 被 hack
---
雜湊（Hash）是解決查找問題的利器，掌握一些常用模板，就能應對大部分情況。
雖然我也看過不少神級解法中，自訂哈希函數來避免碰撞，甚至有辦法繞過原本演算法 只由測資推答案——這些都是進階技巧——但對大多數場景來說，標準庫提供的哈希功能已經足夠使用。
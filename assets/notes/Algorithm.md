## 標籤
不是任一標籤都適合用在某些特定情況，請斟酌使用
- BFS / DFS
- Shortest Path(Dijkstra)：權重非負
- Minimum Spanning Tree：Kruskal 按邊排序；Prim 相鄰矩陣圖
- 拓樸排序(Topological Sort)：拓樸排序不是整個圖的要求，而是對安全子圖的排序工具
- 二分圖(Bipartite)：獨立集 U 和 V 的圖，連成邊
- Strongly Connected Components：Kosaraju 順向 DFS + 反向 DFS；Tarjan：lowlink & stack 一次 DFS 在 dependency graph 常用
- 樹 DP
- 狀壓 DP(Bitmask DP)：「集合狀態」壓縮成一個整數
- 矩陣 DP：最長公共子序列、最長上升子序列、編輯距離
- 字串 DP：迴文子串、正則表達式匹配
- bitset：set/reset/flip/count/any/to_string，快速集合運算
- Greedy：sort、swap 局部最好的選擇
- Backtracking：N 皇后、子集排列組合、數獨
- Divide and Conquer(分冶)：Merge Sort、Quick Sort
- Binary Search：low/high
- Two Pointers：left/right
- Segment Tree(線段樹)：build/update/query
- Fenwick Tree ( BIT )：lowbit
- Union-Find ( DSU )：find(x)找 + union(x,y)合併
- Stack(堆疊)：push/pop/top/empty，DFS
- Queue(佇列)：push/pop/front/back/empty，Queue + BFS 走訪路徑
- Deque(雙端佇列)：push_front/push_back/pop_front/pop_back/front/back/empty，sliding window 最大值
- Hash(字典)：unordered_map、unordered_set 計數、查重常用
- Trie(字典樹)：前綴統計、長字串大量查詢（Hash 會 TLE 或碰撞）、最大 XOR
- Priority Queue(最大堆)：push/pop 預設最大堆，可自訂比較函式
- 快速冪：pow(a,b)%m
- 歐幾里得算法：gcd(a,b)
- 質因數分解
- 質數篩法：埃氏篩
- 模運算：((a-b)%m+m)%m 避免負數
- 計數原理：算有幾種可能
- 排列組合：用計數原理推導出來的公式化方法
- 數論
- Sliding Window 滑動視窗
- KMP：失配的時候不用從頭比起，而是跳到下一個可能成功的位置，由 prefix function 決定
- Z-function：Z[i]是從位置 i 繼續往後看，能跟整個字串的開頭對上多少
- Rabin-Karp(滾動哈希)：基於多項式的哈希函數，子串更新 O(1) → 支援快速比較，多字串匹配
- Manacher：利用對稱性 → 每次擴展時不需從零開始 O(n)
- stringstream：字串流，方便字串按指定分隔符拆分字串
## 誤區
行為穩定，不靠運氣
```txt
== 用來比 double 之類的幾乎一定錯，改 if (fabs(a - b) < 1e-9)
n%2==1 判斷奇偶，負數會錯，從二進制可知，改 n&1
不要用 mp[key]>0 判斷 key 是否存在，如果不存在，會「自動插入」一個值 = 0，改 mp.count(key)
erase() while iterate 直接炸
cmath 的 pow() 回傳 double，不準確，改用自訂快速冪
unordered_map.clear() 不會釋放 bucket，累積下可能 MLE，改 unordered_map<int,int>().swap(mp);
string += char 是 O(n) 不是 O(1)  
stoi 空字串會拋例外
resize(n,val) 前面的保留，只有在放大時空值用 val 來填；縮小時完全忽略第二個參數
放大表示 n > 原本大小，縮小表示 n < 原本大小，不變表示 n == 原本大小
assign(n,val) 不管原來的元素是什麼，全部清掉，類於 vector.clear() + push_back(val) n 次
stringstream ss(",a,b"); getline(ss,data,',') 會讀到 空字串、"a"、"b"，要預防
以上改成 ss("a,b,,"); 一個EOF前的空字串不會被讀取，但還剩一個，可知順序 "a"、"b"、空字串
```
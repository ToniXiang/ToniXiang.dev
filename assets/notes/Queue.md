## 基本概念
Queue（佇列）是一種先進先出（FIFO, First-In-First-Out）的資料結構
- 時間複雜度：push O(1)、pop O(1)、front O(1)
- 空間複雜度：O(n)
- 特性：只能從尾端加入，從前端移除。Deque（雙端佇列）允許兩端操作

## 實作

### 1. Standard Queue
```cpp
#include <queue>
using namespace std;

void example() {
    queue<int> q;
    // 加入元素
    q.push(1);
    q.push(2);
    q.push(3);
    // 取得前端元素
    int front = q.front();  // 1
    // 取得尾端元素
    int back = q.back();    // 3
    // 移除前端元素
    q.pop();                // 移除 1
    // 檢查值
    int size = q.size();    // 2
    // 檢查是否為空
    bool isEmpty = q.empty(); // false
    // 遍歷佇列（需要複製）
    queue<int> temp = q;
    while (!temp.empty()) {
        cout << temp.front() << " ";
        temp.pop();
    }
}
```

### 2. Double-Ended Queue (Deque)
```cpp
#include <deque>
using namespace std;

void dequeExample() {
    deque<int> dq;
    // 前端操作
    dq.push_front(1);     // [1]
    dq.push_front(2);     // [2, 1]
    int front = dq.front(); // 2
    dq.pop_front();       // [1]
    // 尾端操作
    dq.push_back(3);      // [1, 3]
    dq.push_back(4);      // [1, 3, 4]
    int back = dq.back(); // 4
    dq.pop_back();        // [1, 3]
    // 索引訪問，但不建議頻繁使用。queue 不支援
    int val = dq[0];      // 1
    // 大小值
    int size = dq.size(); // 2
}
```
### 3. Priority Queue
另做介紹
## 實戰應用

### 1. BFS 相關
- 層序遍歷（樹、圖）
- 最短路徑（無權圖）
- 連通性問題

### 2. 滑動窗口
- 窗口最大/最小值
- 窗口內統計

### 3. 時間窗口統計
- 最近請求次數
- 點擊率統計
- 時間相關的計數

### 4. 設計題
- 用佇列實作其他資料結構
- 循環佇列
- 雙端佇列應用

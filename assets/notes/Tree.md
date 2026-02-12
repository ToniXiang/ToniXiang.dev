## 基本定義
```cpp
// 通用樹（鄰接表表示）
vector<vector<int>> adj;  // adj[u] = {v1, v2, ...} 表示 u 的鄰居
vector<int> parent;       // parent[u] = u 的父節點
vector<int> depth;        // depth[u] = u 的深度
```
## 實作
### 1. 樹的直徑（Tree Diameter）
**問題**：找到樹中最長路徑的長度
```cpp
// 方法1：兩次DFS
int maxDist = 0, farthest = 0;

void dfs(int u, int p, int dist) {
    if (dist > maxDist) {
        maxDist = dist;
        farthest = u;
    }
    
    for (int v : adj[u]) {
        if (v != p) {
            dfs(v, u, dist + 1);
        }
    }
}

int treeDiameter() {
    // 第一次DFS：從任意點找最遠點
    dfs(1, -1, 0);
    
    // 第二次DFS：從最遠點找直徑
    maxDist = 0;
    dfs(farthest, -1, 0);
    
    return maxDist;
}

// 方法2：樹型DP
int diameter = 0;

int dfs_dp(int u, int p) {
    int max1 = 0, max2 = 0;  // 最長和次長路徑
    
    for (int v : adj[u]) {
        if (v != p) {
            int depth = dfs_dp(v, u);
            if (depth > max1) {
                max2 = max1;
                max1 = depth;
            } else if (depth > max2) {
                max2 = depth;
            }
        }
    }
    
    diameter = max(diameter, max1 + max2);
    return max1 + 1;
}
```

### 2. 最近公共祖先（LCA）
**問題**：快速查詢兩節點的最近公共祖先

```cpp
// 二元提升（Binary Lifting）
const int MAXN = 100005;
const int LOG = 20;

vector<int> adj[MAXN];
int up[MAXN][LOG];  // up[v][j] = v的第2^j個祖先
int depth[MAXN];

void dfs(int u, int p) {
    up[u][0] = p;
    for (int i = 1; i < LOG; i++) {
        up[u][i] = up[up[u][i-1]][i-1];
    }
    
    for (int v : adj[u]) {
        if (v != p) {
            depth[v] = depth[u] + 1;
            dfs(v, u);
        }
    }
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    
    // 讓u和v在同一層
    int diff = depth[u] - depth[v];
    for (int i = 0; i < LOG; i++) {
        if ((diff >> i) & 1) {
            u = up[u][i];
        }
    }
    
    if (u == v) return u;
    
    // 二元搜尋LCA
    for (int i = LOG - 1; i >= 0; i--) {
        if (up[u][i] != up[v][i]) {
            u = up[u][i];
            v = up[v][i];
        }
    }
    
    return up[u][0];
}
```

### 3. 樹上路徑查詢
**問題**：查詢樹上兩點間的距離/路徑和

```cpp
// 樹上兩點距離
int distance(int u, int v) {
    return depth[u] + depth[v] - 2 * depth[lca(u, v)];
}

// 樹上路徑權值和（需要預處理前綴和）
vector<long long> prefix_sum;

void dfs_sum(int u, int p, long long sum) {
    prefix_sum[u] = sum;
    for (int v : adj[u]) {
        if (v != p) {
            dfs_sum(v, u, sum + weight[u][v]);
        }
    }
}

long long path_sum(int u, int v) {
    int l = lca(u, v);
    return prefix_sum[u] + prefix_sum[v] - 2 * prefix_sum[l];
}
```

### 4. 重心分解（Centroid Decomposition）
**問題**：將樹分解為多個部分以優化查詢

```cpp
vector<bool> removed;
vector<int> subtree_size;

int dfs_size(int u, int p) {
    subtree_size[u] = 1;
    for (int v : adj[u]) {
        if (v != p && !removed[v]) {
            subtree_size[u] += dfs_size(v, u);
        }
    }
    return subtree_size[u];
}

int find_centroid(int u, int p, int tree_size) {
    for (int v : adj[u]) {
        if (v != p && !removed[v] && subtree_size[v] > tree_size / 2) {
            return find_centroid(v, u, tree_size);
        }
    }
    return u;
}

void decompose(int u) {
    int tree_size = dfs_size(u, -1);
    int centroid = find_centroid(u, -1, tree_size);
    
    removed[centroid] = true;
    
    // 處理以centroid為根的問題
    
    for (int v : adj[centroid]) {
        if (!removed[v]) {
            decompose(v);
        }
    }
}
```

### 5. 樹型動態規劃範例
**問題**：樹上最大獨立集（不能選相鄰節點）

```cpp
// dp[u][0] = 不選u的最大值
// dp[u][1] = 選u的最大值
vector<vector<int>> dp;

void tree_dp(int u, int p) {
    dp[u][0] = 0;
    dp[u][1] = value[u];  // u節點的權值
    
    for (int v : adj[u]) {
        if (v != p) {
            tree_dp(v, u);
            dp[u][0] += max(dp[v][0], dp[v][1]);
            dp[u][1] += dp[v][0];
        }
    }
}
```

### 6. 換根DP（Re-rooting DP）
**問題**：計算以每個節點為根時的某個值

```cpp
vector<int> ans, down, up;

// 第一次DFS：計算向下的貢獻
void dfs1(int u, int p) {
    down[u] = 1;  // 子樹大小
    for (int v : adj[u]) {
        if (v != p) {
            dfs1(v, u);
            down[u] += down[v];
        }
    }
}

// 第二次DFS：計算向上的貢獻並更新答案
void dfs2(int u, int p) {
    ans[u] = down[u] + up[u];
    
    for (int v : adj[u]) {
        if (v != p) {
            // 將根從u換到v
            int old_down_u = down[u];
            int old_up_v = up[v];
            
            down[u] -= down[v];
            up[v] = down[u] + up[u];
            
            dfs2(v, u);
            
            // 還原
            down[u] = old_down_u;
            up[v] = old_up_v;
        }
    }
}
```

## 常見題型總結
### 樹的基本操作
- 樹的遍歷（DFS/BFS）
- 樹的重建（前序+中序等）
- 樹的序列化與反序列化
### 樹的性質查詢
- 樹的高度/深度
- 樹的直徑
- 樹的重心
- 子樹大小
### 樹上路徑問題  
- 兩點間距離
- 路徑上的最值
- 路徑權值和
- K級祖先查詢
### 樹的動態規劃
- 樹型DP
- 換根DP  
- 樹上背包
- 樹上計數
### 樹的分治算法
- 重心分解
- 點分治
- 邊分治
- 長鏈剖分
---
TreeNode + DFS 是 LeetCode 入門級的用法，但演算法競賽中的「樹」是一整個思維領域，又稱「圖論」，而不是一個 class 或結構而已

## 题目描述

有n个一样的骰子，他们有f面（即骰子的点数从1到f），问投掷这些骰子和为target的概率为多少？

:::warning 注意
不能使用回溯
:::


## 题解

这是一道经典的背包问题。背包问题的详解可以看本网站的这一篇博客->[背包问题详解](./动态规划基础理论.md)

该题目是一个分组背包，只需要在0/1背包基础上加上一层循环遍历每一个分组即可

```cpp
long long mod = 1e9 + 7;
int numRollsToTarget(int n, int f, int target) {
    vector<vector<long long>> dp(n + 1, vector<long long>(target + 1));
    dp[0][0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= f; j++) {
            for (int k = target; k >= j; k--) {
                dp[i][k] = (dp[i][k] + dp[i - 1][k - j]) % mod;
            }
        }
    }
    return dp[n][target];
}
```
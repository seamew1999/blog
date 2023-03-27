## 题目描述

数组 A 中给定可以使用的 1~9 的数，返回由数组 A 中的元素组成的小于 n 的最大数。

> **注意可以元素重复使用**

示例 1：A={1, 2, 9, 4}，n=2533，返回 2499。

示例 2：A={1, 2, 5, 4}，n=2543，返回 2542。

示例 3：A={1, 2, 5, 4}，n=2541，返回 2525。

示例 4：A={1, 2, 9, 4}，n=2111，返回 1999。

示例 5：A={5, 9}，n=5555，返回 999。

## 解法一：暴力回溯

```cpp
#include <bits/stdc++.h>
using namespace std;

long long target;
vector<int> nums;
long long res = 0;
void backtracking(vector<int>& nums, long long target, long long sum) {
    if (sum >= target) {
        return;
    }
    res = std::max<long long int>(res, sum);
    for (int i = 0; i < nums.size(); i++) {
        sum = sum * 10 + nums[i];
        backtracking(nums, target, sum);
        sum = sum / 10;
    }
}
int main() {
    cin >> target;
    cin.get();
    string str;
    getline(cin, str);
    stringstream ss(str);
    string num;
    while (getline(ss, num,',')) {
        nums.push_back(stoi(num));
    }
    backtracking(nums, target, 0);
    cout << res;
    return 0;
}
```

## 解法二：回溯 + 贪心

从高位开始遍历，对每一位先尝试使用相同数字，除了最后一位。如果没有相同的数字时，尝试是否有比当前数字更小的，有的话选更小的数字里最大的，剩下的用最大数字。都没有就向前回溯看前一个有没有更小的。如果一直回溯到第一个数字都没有更小的数字，就用位数更少的全都是最大数字的数。

```cpp
#include <bits/stdc++.h>
using namespace std;

long long target;
vector<int> nums;

int getMaxDigit(vector<int>& nums, int target) {
    for (int i = nums.size() - 1; i >= 0; i--) {
        if (nums[i] < target) {
            return nums[i];
        }
    }
    return 0;
}

int getMaxNum(vector<int>& nums, long long target) {
    vector<int> digits;
    set<int> numSet(nums.begin(), nums.end());
    while (target) {
        digits.push_back(target % 10);
        target = target / 10;
    }
    vector<int> res(digits.size());
    for (int i = digits.size() - 1; i >= 0; i--) {
        // 存在相同的数字，除了最后一位
        if (i > 0 && numSet.find(digits[i]) != numSet.end()) {
            res[i] = digits[i];
            continue;
        }
        // 存在小于当前位的最大数字
        int maxDigit = getMaxDigit(nums, digits[i]);
        if (maxDigit > 0) {
            res[i] = maxDigit;
            break;
        }
        // 需要回溯
        for (int j = i + 1; j < digits.size(); j++) {
            res[j] = 0;
            int maxDigit = getMaxDigit(nums, digits[j]);
            if (maxDigit > 0) {
                res[j] = maxDigit;
                break;
            }
            if (j == digits.size() - 1) {
                digits.resize(digits.size() - 1);
            }
        }
        break;
    }
    // 拼装目标数。
    int sum = 0;
    for (int i = res.size() - 1; i >= 0; i--) {
        sum *= 10;
        if (res[i] > 0) {
            sum += res[i];
            continue;
        }
        // 取数字数组中最大的数字。
        sum += nums.back();
    }
    return sum;
}


int main() {
    cin >> target;
    cin.get();
    string str;
    getline(cin, str);
    stringstream ss(str);
    string num;
    while (getline(ss, num,',')) {
        nums.push_back(stoi(num));
    }
    cout << getMaxNum(nums, target);
    return 0;
}
```


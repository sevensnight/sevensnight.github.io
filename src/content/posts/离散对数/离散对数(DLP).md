---
title: 离散对数(DLP)
published: 2025-08-12
pinned: false
description: 介绍 DLP 的核心定义、相关概念，并详细讲解求解 DLP 的多种算法
tags: [DLP]
category: Article
author: SevensNight
licenseName: "CC BY-NC-SA 4.0"
draft: false
date: 2025-08-12
image: "./1.png"
permalink: "dlp"
---

:::IMPORTANT[离散对数问题]
离散对数问题(Discrete Logarithm Problem,DLP)的定义为:在一个阶为 $n$ 的有限循环群 $G$ (如整数模 $p$ 乘法群 $\mathbb{Z}_p^*$​)中,给定群的生成元 $g$ 和群中元素 $y$ ,求解满足 $g^x=y$ 的整数 $x$ ,其中 $x$ 称为 $y$ 以 $g$ 为底的离散对数,记为 $x = \log_g y$
:::
# 基本定义

形如 $y \equiv g^x \bmod p$ 的式子,其中 $x$ 满足 $0<e<(p-1)$ ,此时我们称 $x$ 是 $y$ 以 $g$ 作为基底模 $p$ 的离散对数,而DLP问题就是求这个指数(离散对数) $x$ 的问题
## 阶

- 定义
    设群 $G$ 中的元素 $g$ ,其阶是最小的正整数 $x$ ,使得 $g^x=e$ ($e$ 是群的单位元(满足对任意元素 $g\in G$,有 $g⋅e=e⋅g=g$))
    - 数学表达
        $\text{ord}(g) = \min\{ x \in \mathbb{Z}^+ \mid g^x = e \}$
    群的阶 $\varphi(m)$ 也就是与模数 $m$ 互素且小于模数 $m$ 的正整数的个数

- 性质
    若 $g^x=e$ ,则 $ord(g)$ 整除 $x$
    元素的阶一定整除群的阶(拉格朗日定理)

:::note[证明]
[拉格朗日定理](https://zhuanlan.zhihu.com/p/597997175)
:::
设 $m \ge 1,\gcd(g,m)=1$ ,使得 $g^x \equiv 1 \pmod m$ 成立的最小正整数 $x$ 称为 $g$ 对模 $m$ 的指数或者阶,一般将其计为 $\delta_m(g)$
满足 $g^x \equiv 1 \pmod m$ 的 $x$ 一定满足 $x \mid \varphi(m)$ (元素的阶整除群阶)
## 生成元

- 定义
    若群 $G$ 的某个元素 $g$ 的阶等于群的阶(即 $\text{ord}(g) = |G|$),则称 $g$ 是 $G$ 的一个生成元(本原元)

- 性质
    由 $g$ 生成的子群 $\langle g \rangle = \{ g^x \mid x \in \mathbb{Z} \}$ 等于整个群 $G$

- 示例
    模 $5$ 乘法群 $G = (\mathbb{Z}_5^*, \times) = \{1, 2, 3, 4\}$
    - 元素 $2$ : $2^1≡2, 2^2≡4, 2^3≡3, 2^4≡1 \pmod 5$ → 元素的阶为 $4$ 且群的阶也为 $4$ ,是生成元
    - 元素 $4$ : $4^1≡4, 4^2≡1, 4^3≡4 \pmod 5$ → 元素的阶为 $2$ ,不是生成元

在一个群 $G$ 中,如果 $g$ 是 $G$ 的生成元,即所有 $G$ 中的所有元素都可以被表示成 $y=g^x$ ,此时的 $x$ 称为 $y$ 在 $G$ 中的对数
## 原根

- 定义 
    在模 $m$ 的乘法群 $\mathbb{Z}_m^*$​ 中,若元素 $g$ 是生成元,则称 $g$ 是模 $m$ 的一个原根

- 存在条件
    $\mathbb{Z}_m^*$ 是循环群当且仅当 $m=2,4,p^k$ 或 $2p^k$ ($p$ 为奇素数)

**示例**
- 模 $7$ : $(\mathbb{Z}_7^*, \times) = \{1, 2, 3, 4, 5, 6\}$ ,元素 $3$ 是原根
    - $3^1≡3, 3^2≡2, 3^3≡6, 3^4≡4, 3^5≡5, 3^6≡1 \pmod 7$ → 元素的阶为 $6$ 且群的阶也为 $6$
- 模 $9$ : $(\mathbb{Z}_9^*, \times) = \{1, 2, 4, 5, 7, 8\}$ ,元素 $2$ 是原根
    - $2^1≡2, 2^2≡4, 2^3≡8, 2^4≡7, 2^5≡5, 2^6≡1 \pmod 9$ → 元素的阶为 $6$ 且群的阶也为 $6$

当 $\delta_m(g)=\varphi(m)$ 时,称 $g$ 是模 $m$ 的原根,简称 $m$ 的原根
只有 $m=2,4,p^k,2p^k$ ($p$ 为奇素数, $k$ 为正整数)时,模 $m$ 的剩余系存在原根(充要条件)
## 指数

- 定义
    设 $g$ 是群 $G$ 的生成元,对任意 $y \in G$ ,存在唯一整数 $x \in \mathbb{Z},\ 0 \leq x \leq |G| - 1$ 使得 $y=g^x$
    称 $x$ 为 $y$ 的指数(或以 $g$ 为底的离散对数),记作 $x = \log_g y$

- 性质
    满足对数运算律
    - $\log_g (ab) \equiv \log_g a + \log_g b \pmod{|G|}$

- 示例
    在 $\mathbb{Z}_7^*$ 中,取生成元 $g=3$
    - 求 $y=4$ 的指数: $3^x \equiv 4 \pmod 7 → x=4$
    - 故 $\log⁡_3 4=4$ 在模 $6$ 意义下(群的阶为 $6$)

# 各算法函数运用

参数说明:求解以`base`为底,`a`的对数`x`;`ord`为`base`的阶,可以缺省,`operation`可以是`+`与`*`,默认为`*`;`bounds`是一个区间`(ld,ud)`,需要保证所计算的对数在此区间内
## discrete_log(a,base,ord,operation)
### 介绍

- 通用的求离散对数的方法
- 函数`discrete_log`的别名为`discrete_log_generic`
### 应用
#### 例题

```python
from Crypto.Util.number import *
import random

flag = b'qqqy{discrete_logarithm_is_hard}'
m = 2 ** 512
g = random.randint(2, m-1) | 1 # 确保g为奇数
y = pow(g, bytes_to_long(flag), m)
print(f'g = {g}')
print(f'y = {y}')
'''
g = 2393463364210890048876134025282415506888761799655984913932814380546022900763636216094768455432164239492885202848350909855000796164431285166535180242961967
y = 9330484237616441765813604577924025601468027021274556442043422512586938983420629112867771966675457415612710296980655219892286108961974295535719151822417775
'''
```
##### 思路

- 已知 $y,m,g,y=(g^x) \% m$ ,求 $x$ ,即 $y$ 与 $g^x$ 对模 $m$ 同余,或者说 $(y-g^x) \% m=0$
- 我们说 $\text{mod}(g, m)$ 表示 $g$ 在 $\mathbb{Z}_m^*$ 里的元素, $\text{mod}(y, m)$ 表示 $y$ 在 $\mathbb{Z}_m^*$ 里的元素
- 然后`discrete_log`就会在这个群里求解指数(离散对数)
##### 解答

```python
from Crypto.Util.number import *
m = 2 ** 512
g = 
y = 
flag=discrete_log(y,mod(g,m))
#flag=discrete_log(mod(y,m),mod(g,m))
'''
G = Integers(m) # 构造模m的整数环
base = G(g) # 转换为环G中的元素
a = G(y)
flag = discrete_log(a, base)
'''
print(long_to_bytes(flag))
```
### 源代码

- [sage/src/sage/groups/generic.py at develop · sagemath/sage](https://github.com/sagemath/sage/blob/develop/src/sage/groups/generic.py#L696)
## discrete_log_rho(a,base,ord,operation)
### 介绍

- 求离散对数的**Pollard-Rho算法**,其是John Pollard发明的一种能快速找到大整数的一个非1,非自身的因子(非平凡因子)的算法,之后在1978年Pollard又利用循环群 $ρ$ 形的特点提出了用于解决离散对数问题的PR算法,后来也扩展到了椭圆曲线上

Pollard-Rho算法是一种随机化算法,可以在 $O(\sqrt{p}) = O(N^{1/4})$ 的期望复杂度获得一个非平凡因子
他的核心想法是对于一个随机自映射 $f: \mathbb{Z}_p \to \mathbb{Z}_p$ ,从任何一点 $x_1$ 出发,迭代计算 $x_n=f(x_{n - 1})$ ,将在 $O(\sqrt p)$ 期望时间内进入循环,如果能够找到 $x_i \equiv x_j \pmod{p}$ ,则 $p$ 整除 $\gcd(|x_i - x_j|, N)$ ,这一最大公约数就是 $N$ 的一个非平凡因子

解决离散对数问题的Pollard-Rho算法,可以帮助我们在有限的循环群上解决离散对数问题,简单来看我们取一个大素数 $P$ ,设 $G$ 为一个乘法的循环群,其生成元为 $g$ ,则该群的阶就是 $N=P-1$ ,此时在 $G$ 上的离散对数问题就是对于 $G$ 中的元素 $q$ ,找到 $x$ 使得 $g^x=q$ ,而Pollard-Rho算法主要就是利用了循环群的生成序列呈现一个 $ρ$ 字形状

注:此算法适用于生成元的阶的素因子都是大数的情形,常用于形如 $p=2q+1$ 的安全素数的求解
### 源代码

- [sage/src/sage/groups/generic.py at develop · sagemath/sage](https://github.com/sagemath/sage/blob/develop/src/sage/groups/generic.py#L523)
### 自定义脚本

```python
def pollard_rho(g, y, p):
    q = (p-1) // 2
    def new_xab(x, a, b,  g, y, p, q):
        subset = x % 3
        if subset == 0:
            return ((x*x) % p, (a*2) % q, (b*2) % q)
        if subset == 1:
            return ((x*g) % p, (a+1) % q, b)
        if subset == 2:
            return ((x*y) % p, a, (b+1) % q)
    x, a, b = 1, 0, 0
    X, A, B = x, a, b
    for i in range(1, p):
        x, a, b = new_xab(x, a, b,  g, y, p, q)
        X, A, B = new_xab(X, A, B,  g, y, p, q)
        X, A, B = new_xab(X, A, B,  g, y, p, q)
        if x == X:
            break
    res = ((a - A) * pow(B - b, -1, q)) % q
    if pow(g, res, p) == y:
        return res
    if pow(g, res + q, p) == y:
        return res + q
    return None

g = 
y = 
p = 
x = pollard_rho(g, y, p)
print(x)
print(pow(g, x, p) == y)
```
## discrete_log_lambda(a,base,bounds,operation)
### 介绍

- 求离散对数的**Pollard-kangaroo算法**(也称为lambda算法)
### 源代码

- [sage/src/sage/groups/generic.py at develop · sagemath/sage](https://github.com/sagemath/sage/blob/develop/src/sage/groups/generic.py#L1013)
## bsgs(base,a,bounds,operation)
### 介绍

- **大步小步算法**(Baby-Step Giant-Step, BSGS);大步小步算法常用于解决解高次同余方程的问题,问题形式如:有同余方程$a^x \equiv b \pmod p$ , $p$ 为质数,求最小非负整数解 $x$ 使得原方程成立,这类问题也称为离散对数问题,该算法的复杂度可以达到 $O(\sqrt{p}\log{n})$ 甚至更低
- 这种方法更适用于如DH协议的加密,亦或ECDLP问题的求解上,最常见的如MITM攻击
### 应用
#### 例题

```python
from Crypto.Util.number import *

p = getPrime(256)
g = getPrime(32)
x = getPrime(32)
y = pow(g, x, p)
print(f'p = {p}')
print(f'g = {g}')
print(f'y = {y}')
'''
p = 71130990921858286771835345800864443154206899325481432206394783848218408026387
g = 2845666657
y = 35627413523291661346258680942597162469028109909702377319382315261438620417657
'''
#求x
```
##### 思路

- 利用BSGS算法的分块思想,在指定的 $(2^{31}, 2^{32})$ 范围内,通过预计算小步和匹配大步,高效找到满足 $g^x \equiv y \bmod p$ 的对数 $x$
##### 解答

```python
from sage.groups.generic import bsgs
p = 
g = 
y = 
x = bsgs(mod(g, p), mod(y, p), bounds=(2**31, 2**32))
print(f'x = {x}')
#x = 2783899049
```
### 源代码

- [sage/src/sage/groups/generic.py at develop · sagemath/sage](https://github.com/sagemath/sage/blob/develop/src/sage/groups/generic.py#L373)
### 自定义脚本

:::tip[原版]
:::

```python
def babystep_giantstep(g, y, p):
    m = int((p-1)**0.5 + 0.5)
    # Baby step
    table = {}
    gr = 1  # g^r
    for r in range(m):
        table[gr] = r
        gr = (gr * g) % p
    # Giant step
    gm = pow(g, -m, p)  # gm = g^{-m}
    ygqm = y            # ygqm = y * g^{-qm}
    for q in range(m):
        if ygqm in table: # 当右边和左边相等时
            return q * m + table[ygqm]
        ygqm = (ygqm * gm) % p
    return None

g = 
y = 
p = 
x = babystep_giantstep(g, y, p)
print(x)
print(pow(g, x, p) == y)
```

:::tip[可限定范围版]
:::

```python
def babystep_giantstep(g, y, p, low, high):
    m = int((high - low)**0.5 + 0.5)
    table = {}
    gr = pow(g, low, p)
    for r in range(m):
        table[gr] = low + r
        gr = (gr * g) % p
    gm = pow(g, -m, p)
    ygqm = y
    for q in range(m):
        if ygqm in table:
            return q * m + table[ygqm]
        ygqm = (ygqm * gm) % p
    return None

p = 
g = 
y = 
x = babystep_giantstep(g, y, p, 2**31, 2**32)
print(x)
print(pow(g, x, p) == y)
```
## pohlig_hellman_DLP(base, a, p)
### 介绍

- **Pohig-Hellman算法**是一种求解光滑阶循环群上的离散对数的方法

Pohlig-Hellman算法的复杂度在一般情况下比BSGS算法高,但是在特殊情况下(循环群的阶是光滑数,即可以因子分解成较小的数的乘积),使用Pohlig-Hellman能取得好的效果,而且有些时候,尽管BSGS能够将复杂度降至$\sqrt{p}$ ,但是这个数依然很大,所以不能用,这时可以考虑Pohlig-hellman方法能不能起作用

- 算法思想
    - 考虑DLP问题: $a^x \equiv b \pmod p$ ,因为 $p$ 是大素数,模 $p$ 的循环群的阶是 $p−1$ ,假设模 $p$ 的最小的本原元是 $g$ (本原元是可以求的),那么有 $$\left\{\begin{array}{c} a \equiv g^{a'} \pmod p \\ b \equiv g^{b'} \pmod p \end{array}\right.$$
    - 进一步有 $a^x \equiv b \pmod p \Longleftrightarrow g^{a'x} \equiv g^{b'} \pmod p$
    
    - 有 $a'x \equiv b' \pmod {p-1}$
    
    - 如果求出了满足上式的 $a'$ 和 $b'$ ,通过扩展 $\gcd$ 方法可以求一次同余方程的解得到 $x$ 
    
    - 问题归结成如何求 $a'$ 和 $b'$ ,即原本的一个离散对数问题,现在变成两个离散对数问题 $$\left\{\begin{array}{c} a \equiv g^{a'} \pmod p \\ b \equiv g^{b'} \pmod p \end{array}\right.$$
    - 以求 $a'$ 为例,解DLP问题: $g^x \equiv a \pmod p$ :
    1. 将 $p-1$ 进行标准的素因子分解，即 $p-1=\prod\limits_{i=1}^{m} p_i^{k_i}=p_1^{k_1}p_2^{k_2}p_3^{k_3} \cdots p_m^{k_m}$
        
    2. 对每个素因子 $p_i$ ,将 $x$ 表示成 $p_i$ 进制,有
        
        $x=a_0+a_1p_1+a_2p_2^2+a_3p_3^3+\dots+a_{k_i-1}p_i^{k_i-1} \pmod {p_i^{k_i}}$
        
        这样的 $p_i$ 进制表示,系数 $a_i$ 自然是小于 $p_i$
        
    3. 令 $r=1$ ,有 $(g^x)^{\frac{p-1}{p_i^r}} \equiv a^{\frac{p-1}{p_i^r}} \pmod p$ ,展开 $x$ 有
        
        $(g^{a_0+a_1p_1+a_2p_2^2+a_3p_3^3+\dots+a_{k_i-1}p_i^{k_i-1}})^{\frac{p-1}{p_i^r}} \equiv a^{\frac{p-1}{p_i^r}} \pmod p$
        
        $g^{a_0{\frac{p-1}{p_i}}} \cdot g^{a_1(p-1)} \cdot g^{a_2(p-1)p_i} \cdots g^{a_{k_i-1}(p-1)p_i^{k_i-2}} \equiv a^{\frac{p-1}{p_i}} \pmod p$
        
        注意从第二项开始,每一项指数都包含 $p−1$ (由费马小定理知 $g^{p-1} \equiv 1 \pmod p$) ,所以式子变成
        
        $g^{a_0{\frac{p-1}{p_i}}} \equiv a^{\frac{p-1}{p_i}} \pmod p$
        
        这个式子中只有 $a_0$ 是未知的，因为 $a_0 \in [0,p_i−1]$，所以可以穷举得到 $a_0$ 的值
        
    4. 再令 $r=2,3,4,\cdots,k_i$ ,重复步骤3,依次穷举求出 $a_1,a_2,\cdots,a_{k_i-1}$，整个的时间复杂度是 $\mathrm{O}(p_ik_i)$ 可以得到
        
        $x=a_0+a_1p_1+a_2p_2^2+a_3p_3^3+\dots+a_{k_i-1}p_i^{k_i-1} \pmod {p_i^{k_i}}$
        
    5. 重复上述过程,得到 $m$ 个关于 $x$ 的式子,利用中国剩余定理(CRT),可以计算出 $x$ 的值
    
    - 利用这个方法求出 $a'$ 和 $b'$ 后,就可以得到原DLP问题的解

需要注意的是
- Pohlig-Hellman算法最重要的点是利用了原根的性质,它只能解决 $a \equiv g^x \pmod p$ ($g$ 是原根)的问题,对于 $g$ 不是原根的情况,需要利用原根将原方程转化成两个关于原根的离散对数问题
- 注意Pohlig-hellman只能用于**求解光滑阶群**,也就是 $p-1$ 可以分解成小的素因子乘积,否则,穷举 $a_i$ 的时间复杂度依旧很高,另外可以考虑在穷举 $a_i$ 时利用小步大步算法,进一步优划算法复杂度
### 应用
#### 例题-1

```python
from Crypto.Util.number import *
x = getPrime(64)
p = getPrime(1024)
g = getPrime(120)
y = pow(g,x,p)
print(f'g = {g}\ny = {y}\np = {p}')
'''
g = 804906270584743616530750586774407621
y = 39801560642934939276644788319320164055037225352752909850007295599733810946551136177040075255295076834610483821419072380392357902791639912254038813336248943611835190848248284771923197831739468364780297339890167987777585852805275608428195203441947683040103499896092301599143537370522495196887437324544112311967
p = 135413548968824157679549005083702144352234347621794899960854103942091470496598900341162814164511690126111049767046340801124977369460415208157716471020260549912068072662740722359869775486486528791641600354017790255320219623493658736576842207668208174964413000049133934516641398518703502709055912644416582457721
'''
#求x
```
##### 思路

- 将上面的 $p-1$ 进行分解可得到小的素因子如 $23 × 5 × 263 × 587 × 28142457071 × 395710839697$ ,因此可以尝试Pohlig-Hellman算法
- 而Pohlig-Hellman算法的核心思想是将模 $p$ 乘法群上的离散对数问题,分解到 $p-1$ 的素因子幂子群上求解,再通过中国剩余定理组合结果,其效率直接取决于 $p-1$ 的最大素因子的大小 —— 素因子越小,子群上的DLP越容易求解(尤其是配合Baby-step Giant-step方法时避免内存溢出)
- 所以加一个限定条件(`if q > 1000000000000: break`)尽可能用上更多的小的素因子
##### 解答-1

```python
# Baby-step Giant-step法
def babystep_giantstep(g, y, p, q=None):
    if q is None:
        q = p - 1
    m = int(q**0.5 + 0.5)
    # Baby step
    table = {}
    gr = 1  # g^r
    for r in range(m):
        table[gr] = r
        gr = (gr * g) % p
    # Giant step
    try:
        gm = pow(g, -m, p)  # gm = g^{-m}
    except:
        return None
    ygqm = y                # ygqm = y * g^{-qm}
    for q in range(m):
        if ygqm in table:
            return q * m + table[ygqm]
        ygqm = (ygqm * gm) % p
    return None

# Pohlig–Hellman法
def pohlig_hellman_DLP(g, y, p):
    crt_moduli = []
    crt_remain = []
    for q, _ in factor(p-1):
        if q > 1000000000000:
            break
        x = babystep_giantstep(pow(g,(p-1)//q,p), pow(y,(p-1)//q,p), p, q)
        if (x is None) or (x <= 1):
            continue
        crt_moduli.append(q)
        crt_remain.append(x)
    x = crt(crt_remain, crt_moduli)
    return x

g = 
y = 
p = 
x = pohlig_hellman_DLP(g, y, p)
print(x)
#14093634432527092081
print(pow(g, x, p) == y)
```
#### 例题-2

```python
from Crypto.Util.number import *  
from secrets import flag
p = getPrime(512)
g = getPrime(512)
while g > p:
    g = getPrime(512)
y = pow(g,flag,p)
print(f'p = {p}')
print(f'g = {g}')
print(f'y = {y}')

# p = 6897108443075981744484758716081045417854227543713106404294789655180105457499042179717447342593790180943415014044830872925165163457476209819356694244840079
# g = 6789891305297779556556571922812978922375073901749764215969003309869718878076269545304055843125301553103531252334876560433405451108895206969904268456786139
# y = 1315637864146686255246675143589215932218700984880749264689270214639479160648747323586062096067740047809798944996253169402675772469028914904598116394230426
```
##### 思路

- 依据上题我们求对数,但是发现所求结果不满足`pow(g, x, p) == y`,此时需要注意,如果 $x_p≠x$ ,即 $x=x_p+km$ ,那么可能需要小范围爆破
- 这里的`primes`只是 $p-1$ 的部分小因子而非完整的素因子分解,那么`prod(primes)`实际上是 $p$ 的一个约数(记为 $m$)
- 对于一个质数 $p$ 来说,模 $p$ 乘法群 $\mathbb{Z}_p^*$​ 是由 $1$ 到 $p−1$ 的整数构成,在模 $p$ 乘法下封闭的群,它的阶(元素个数)是 $p−1$
- 我们记 $n=p-1$ ,对于群中元素 $x \in \mathbb{Z}_p^*$ ​,它的阶 $d$ 是满足 $g^d \equiv 1 \pmod p$ 的最小正整数,根据群论的拉格朗日定理,元素的阶 $d$ 一定能整除群的阶 $n$ ,即 $d \mid n$ ($n$ 是 $d$ 的倍数)
- 因为 $d \mid n$ ,所以 $n=d⋅t$ ($t$ 是整数),结合元素阶的定义(费马小定理) $g^d \equiv 1 \pmod p$ ,我们可以推导
    
     $\begin{aligned} g^{x + k \cdot n} &= g^x \cdot g^{k \cdot n} \quad \text{(指数运算法则: } a^{m + n} = a^m \cdot a^n \text{)} \\ &= g^x \cdot \left(g^n\right)^k \quad \text{(指数运算法则: } a^{m \cdot n} = \left(a^m\right)^n \text{)} \\ &= g^x \cdot \left(g^{d \cdot t}\right)^k \quad \text{(因为 } n = d \cdot t \text{)} \\ &= g^x \cdot \left(\left(g^d\right)^t\right)^k \quad \text{(指数运算法则: } a^{m \cdot n} = \left(a^m\right)^n \text{)} \\ &= g^x \cdot \left(1^t\right)^k \quad \text{(因为 } g^d \equiv 1 \pmod{p}\text{, 所以 } \left(g^d\right)^t \equiv 1^t \equiv 1 \pmod{p} \text{)} \\ &= g^x \cdot 1^k \\ &= g^x \pmod{p} \end{aligned}$
    
- 这也就说明 $g^x \equiv g^{x \bmod n} \pmod{p}$ ,即 $x$ 与 $x \bmod n$ 在模 $p$ 下的幂运算结果相同,因此, $x$ 本质上是模 $n$ 意义下的解,完整解可表示为 $x = x0 + kn$ ($x0$ 是模 $n$ 的最小解, $k$ 为整数)
- 而在此题中,我们对于离散对数的求解范围始终是限定在 $p-1$ 的小因子上,所以求的也只是这部分因子经过CRT的离散对数 $x_p$
- 此时算法只能得到 $x$ 模小因子乘积 $m$ (`m = q1^e1 * ... * qt^et`,`t < k`)的解 $x_p$ ,即: $x \equiv x_p​ \bmod m$
- 这意味着 $x$ 与 $x_p$ 除以 $m$ 的余数相同,换句话说即 $x - x_p$ 一定是 $m$ 的倍数,因此 $x$ 可表示为: $x=x_p​+km$ ($k$ 为整数),而 $m$ 就是小因子的乘积
##### 解答-2.1

```python
# Baby-step Giant-step法
def babystep_giantstep(g, y, p, q=None):
    if q is None:
        q = p - 1
    m = int(q**0.5 + 0.5)
    # Baby step
    table = {}
    gr = 1  # g^r
    for r in range(m):
        table[gr] = r
        gr = (gr * g) % p
    # Giant step
    try:
        gm = pow(g, -m, p)  # gm = g^{-m}
    except:
        return None
    ygqm = y                # ygqm = y * g^{-qm}
    for q in range(m):
        if ygqm in table:
            return q * m + table[ygqm]
        ygqm = (ygqm * gm) % p
    return None

# Pohlig–Hellman法
def pohlig_hellman_DLP(g, y, p):
    crt_moduli = []
    crt_remain = []
    for q, _ in factor(p-1):
        if q > 10000000000:
            break
        x = babystep_giantstep(pow(g,(p-1)//q,p), pow(y,(p-1)//q,p), p, q)
        if (x is None) or (x <= 1):
            continue
        crt_moduli.append(q)
        crt_remain.append(x)
    x = crt(crt_remain, crt_moduli)
    return x

p = 
y = 
g = 
x = pohlig_hellman_DLP(g, y, p)
print(x)
print(pow(g, x, p) == y)
#7862794497789978831866877817558762978057073629857544225473859865342211671453902824785875
#False
from Crypto.Util.number import *
xp = 7862794497789978831866877817558762978057073629857544225473859865342211671453902824785875
primes = [2,3,193,877,2663,662056037,812430763,814584769,830092927,849943517,969016409,1000954193,1022090869,1048277339]
for k in range(2**10):
    res = long_to_bytes(xp + k * prod(primes))
    if res.startswith(b'flag'):
        print(res)
        break
#flag{70b1b709ce431682addb581596320007}
```
##### 解答-2.2

```python
p = 
y = 
g = 

n = p - 1
primes = list(filter(lambda x: x < 2 ** 32, (base ** exp for base, exp in factor(n))))
dlogs = []
for fac in primes:
    t = int(n) // int(fac)
    dlog = discrete_log(pow(y, t, p), pow(g, t, p))
    dlogs.append(dlog)
xp = int(crt(dlogs, primes))
print(xp)
#7862794497789978831866877817558762978057073629857544225473859865342211671453902824785875
from Crypto.Util.number import *
xp = 7862794497789978831866877817558762978057073629857544225473859865342211671453902824785875
primes = [2,3,193,877,2663,662056037,812430763,814584769,830092927,849943517,969016409,1000954193,1022090869,1048277339]
for k in range(2**10):
    res = long_to_bytes(xp + k * prod(primes))
    if res.startswith(b'flag'):
        print(res)
        break
#flag{70b1b709ce431682addb581596320007}
```
### 自定义脚本

```python
# Baby-step Giant-step法
def babystep_giantstep(g, y, p, q=None):
    if q is None:
        q = p - 1
    m = int(q**0.5 + 0.5)
    # Baby step
    table = {}
    gr = 1  # g^r
    for r in range(m):
        table[gr] = r
        gr = (gr * g) % p
    # Giant step
    try:
        gm = pow(g, -m, p)  # gm = g^{-m} 
    except:
        return None
    ygqm = y                # ygqm = y * g^{-qm}
    for q in range(m):
        if ygqm in table:
            return q * m + table[ygqm]
        ygqm = (ygqm * gm) % p
    return None

# Pohlig–Hellman法
def pohlig_hellman_DLP(g, y, p):
    crt_moduli = []
    crt_remain = []
    for q, _ in factor(p-1):
        x = babystep_giantstep(pow(g,(p-1)//q,p), pow(y,(p-1)//q,p), p, q)
        if (x is None) or (x <= 1):
            continue
        crt_moduli.append(q)
        crt_remain.append(x)
    x = crt(crt_remain, crt_moduli)
    return x

g = 
y = 
p = 
x = pohlig_hellman_DLP(g, y, p)
print(x)
print(pow(g, x, p) == y)
```
## index_calculus(base, a, p, B=None)
### 介绍

**指数计算法**(Index Calculus Algorithm)
### 自定义脚本

```python
def is_Bsmooth(b, n):
    factors = list(factor(int(n)))
    if len(factors) != 0 and factors[-1][0] <= b: 
        return True, dict(factors)
    else:
        return False, dict(factors)

def find_congruences(B, g, p, congruences=[]):
    unique = lambda l: list(set(l))
    bases = []
    max_equations = prime_pi(B)
    while True:
        k = randint(2, p-1)
        ok, factors = is_Bsmooth(B, pow(g,k,p))
        if ok:
            congruences.append((factors, k))
            if len(congruences) >= max_equations:
                break
    bases = unique([base for c in [c[0].keys() for c in congruences] for base in c])
    return bases, congruences

def to_matrices(R, bases, congruences):
    M = [[c[0][base] if base in c[0] else 0 \
            for base in bases] for c in congruences]
    b = [c[1] for c in congruences]
    return Matrix(R, M), vector(R, b)

def index_calculus(g, y, p, B=None):
    R = IntegerModRing(p-1)
    if B is None:
        B = ceil(exp(0.5*sqrt(2*log(p)*log(log(p)))))
    bases = []
    congruences = []
    for i in range(100):
        bases, congruences = find_congruences(B, g, p, congruences)
        M, b = to_matrices(R, bases, congruences)
        try:
            exponents = M.solve_right(b)
            break
        except ValueError:
            # matrix equation has no solutions
            continue
    else:
        return None
    # ag^y mod p
    while True:
        k = randint(2, p-1)
        ok, factors = is_Bsmooth(B, (y * pow(g,k,p)) % p)
        if ok and set(factors.keys()).issubset(bases):
            print('found k = {}'.format(k))
            break
    print('bases:', bases)
    print('q:', factors.keys())
    dlogs = {b: exp for (b,exp) in zip(bases, exponents)}
    x = (sum(dlogs[q] * e for q, e in factors.items()) - k) % (p-1)
    if pow(g, x, p) == y:
        return x
    return None

g = 
y = 
p = 
x = index_calculus(g, y, p)
print(x)
print(pow(g, x, p) == y)
```
---
# 其他类型DLP

待补充……



> 参考
> https://lazzzaro.github.io/2020/05/07/crypto-%E7%A6%BB%E6%95%A3%E5%AF%B9%E6%95%B0/
> https://doc.sagemath.org/html/en/reference/groups/sage/groups/generic.html
> https://hasegawaazusa.github.io/discrete-logarithm-note.html

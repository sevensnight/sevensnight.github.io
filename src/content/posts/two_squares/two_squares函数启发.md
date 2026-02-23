---
title: two_squares函数启发
published: 2025-07-21
pinned: false
description: 利用高斯整数环和 two_squares 相关算法分解形如 a²+b²=N 的大数
tags: [Gaussian integer]
category: Article
author: SevensNight
licenseName: "CC BY-NC-SA 4.0"
draft: false
date: 2025-07-21
permalink: "two-squares"
---

# 题目-1

:::CAUTION[题目来源]
[H&NCTF 2024] EZmath
:::
```python
from Crypto.Util.number import *
flag = b'Kicky_Mu{KFC_v_me_50!!!}'
p = getPrime(256)
q = getPrime(256)
n = p*q**3
e = # what is usually used ? #65537
N = pow(p, 2) + pow(q, 2)
m = bytes_to_long(flag)
c = pow(m,e,n)
 
print(c)
print(N)
 
c = 34992437145329058006346797890363070594973075282993832268508442432592383794878795192132088668900695623924153165395583430068203662437982480669703879475321408183026259569199414707773374072930515794134567251046302713509056391105776219609788157691337060835717732824405538669820477381441348146561989805141829340641
N = 14131431108308143454435007577716000559419205062698618708133959457011972529354493686093109431184291126255192573090925119389094648901918393503865225710648658
```

## 解题思路

- **two_squares**

+ 在sagemath中有一个函数`two_squares`可以直接分解形如 $a^2+b^2=N$ 的数
+ 但是有个问题是这个函数只会返回一组解且 $a$ 和 $b$ 可能同时为素数或合数或一个素数一个合数(在下一题有体现)

- [Integer factorization calculator](https://www.alpertron.com.ar/ECM.HTM)分解


## 解答

```Python
from Crypto.Util.number import *
 
c = 34992437145329058006346797890363070594973075282993832268508442432592383794878795192132088668900695623924153165395583430068203662437982480669703879475321408183026259569199414707773374072930515794134567251046302713509056391105776219609788157691337060835717732824405538669820477381441348146561989805141829340641
N = 14131431108308143454435007577716000559419205062698618708133959457011972529354493686093109431184291126255192573090925119389094648901918393503865225710648658
p,q=two_squares(N)
n = p * q ** 3
e = 65537
phi = (p - 1) * (q - 1) * q ** 2
d = inverse(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
#H&NCTF{D0_Y0u_know_Complex_n3mbers?hahaha}
```
---
# 题目-2

```python
from Crypto.Util.number import *  
  
flag = b'qqqy{******}'  
  
p = getPrime(256)  
q = getPrime(256)  
n = p ** 2 * q ** 3  
e = 65537  
N = p ** 2 + q ** 2  
m = bytes_to_long(flag)  
c = pow(m, e, n)  
  
print(f'c = {c}')  
print(f'N = {N}')  
  
'''  
c = 6213821885972957598682671714020013335408863255755419706556395400896297468146793182597800693069147754359933051135998086909457100567592698532245969194482119142450331519165775529775641738051671890307829051317859332039859825370003740172207413609314343847850170745031408906194699412708038331711695891109600261227061048345172217197566261450476739581298331463222371790187612685451942231866092  
N = 18036379935649899281719719960900134329975732067841219773440376800149553496298696461303290259937812255563356277068919300440461912502580455765095286245121650  
'''
```

## 解题思路

+ 我们首先用`two_squares`函数分解这个 $N$ 发现得到的结果是不符合 $p$ , $q$ 为素数的条件

```Python
N = 18036379935649899281719719960900134329975732067841219773440376800149553496298696461303290259937812255563356277068919300440461912502580455765095286245121650
p,q=two_squares(N)
print(p,q)
#68215159943505953383831271521479211349161892473347435925023838833754543375225 115685227620175429797312822551950855874286281323553557982728392283395551029855
```

+ 因此我们使用[Integer factorization calculator](https://www.alpertron.com.ar/ECM.HTM)来查询一下发现有20多组结果

+ 我们可以选择穷举的方法求解
+ 不过我还是对`two_squares`函数的实现感到好奇,不如我们使用`two_squares`函数来实现返回所有值并判断穷举一下吧
+ 经过搜索我们可知`two_squares`函数是根据高斯整数环数论来实现的高效分解 $a^2+b^2$

:::IMPORTANT[高斯整数环]
高斯整数环(ring of Gauss integers)是[欧氏环](https://baike.baidu.com/item/%E6%AC%A7%E6%B0%8F%E7%8E%AF/19003680?fromModule=lemma_inlink)的一个著名例子,设 $\mathbb{Z}[i] = \{ a + bi \mid a, b \in \mathbb{Z}, i = \sqrt{-1} \}$ ( $a$ , $b$ 是整数, $i$ 为虚数单位), $\mathbb{Z}[i]$ 对通常数的加法和乘法构成一个整环,称为高斯整数环,而将 $a +bi → a^2+b^2$ 是从 $\mathbb{Z}[i] \setminus \{0\}$ 到非负整数集的映射,并且这个映射满足欧氏环定义的条件,因此, $\mathbb{Z}[i]$ 也是欧氏环
:::
实现原理如下:
+ **`费马平方和定理`**:一个大于 $1$ 的正整数 $n$ 可以表示为两个平方数之和,当且仅当在它的质因数分解中,所有模 $4$ 余 $3$ 的素数的幂次都是偶数
+ **`高斯整数分解`**:在 $\mathbb{Z}[i]$ 中,模 $4$ 余 $1$ 的素数 $p$ 可以分解为 $\pi \cdot \overline{\pi}$ ,其中 $\pi$ 和 $\overline{\pi}$ 是共轭的高斯素数

+ 具体数论求解原理不解释了,下方是实现代码 [sum of 2 squares - ASKSAGE: Sage Q&A Forum](https://ask.sagemath.org/question/76636/sum-of-2-squares/)

```python
def reps(n):
    """Searching for all different representations n = S² + T², where n > 0 is an integer
    """
    sols = []    # and we append solutions sol one by one when found
    first_prime, choices, R = True, [], GaussianIntegers()

    for p, mul in factor(n):
        if p == 2:
            choices.append( [(1 + i)^mul] )
        elif p % 4 != 1:
            return []            
        else:
            pp = R(p).factor()[0][0]    # first factor of p seen in ZZ[i]
            if first_prime:
                first_prime = False
                choices.append( [pp^mul] )
            else:
                choices.append( [pp^mul, pp.conjugate()^mul] )
    for choice in cartesian_product(choices):
        S, T = R(prod(choice))
        S, T = abs(S), abs(T)
        if S > T:    S, T = T, S
        sols.append((S, T))
    sols.sort()
    return sols

print(reps(N))
```

## 解答

:::tip[解法1]
高斯整数环分解后判断穷举[比较麻烦]
:::
```python
from Crypto.Util.number import *  
  
c = 6213821885972957598682671714020013335408863255755419706556395400896297468146793182597800693069147754359933051135998086909457100567592698532245969194482119142450331519165775529775641738051671890307829051317859332039859825370003740172207413609314343847850170745031408906194699412708038331711695891109600261227061048345172217197566261450476739581298331463222371790187612685451942231866092  
N = 18036379935649899281719719960900134329975732067841219773440376800149553496298696461303290259937812255563356277068919300440461912502580455765095286245121650  
e = 65537  
  
def reps(n):  
    """Searching for all different representations n = S² + T², where n > 0 is an integer  
    """    sols = []    # and we append solutions sol one by one when found  
    first_prime, choices, R = True, [], GaussianIntegers()  
  
    for p, mul in factor(n):  
        if p == 2:  
            choices.append( [(1 + i)^mul] )  
        elif p % 4 != 1:  
            return []  
        else:  
            pp = R(p).factor()[0][0]    # first factor of p seen in ZZ[i]  
            if first_prime:  
                first_prime = False  
                choices.append( [pp^mul] )  
            else:  
                choices.append( [pp^mul, pp.conjugate()^mul] )  
    for choice in cartesian_product(choices):  
        S, T = R(prod(choice))  
        S, T = abs(S), abs(T)  
        if S > T:    S, T = T, S  
        if S in ZZ and T in ZZ:  # 转换为 int 类型
            sols.append((ZZ(S), ZZ(T)))
    sols.sort()  
    return sols  
  
combinations = reps(N)  
  
for p, q in combinations:  
    if isPrime(p) and isPrime(q):  
        n = p ** 2 * q ** 3  
        phi = (p - 1) * (q - 1) * q ** 2 * p  
        d = inverse(e, phi)  
        m = pow(c, d, n)  
        flag = long_to_bytes(m)  
        if b'qqqy' in flag:  
            print(f"p = {p}, q = {q}")  
            print(flag)  
            break  
  
'''  
p = 93690424704840405256880569567004736912451772675700400671167376891014438404811, q = 96221017736649044150977794536711908878756746657762100525114358908567992301173  
b'qqqy{th1s_i5_r34lly_Ring_0f_G4uss_integers}'  
'''
```

:::tip[解法2]
在复数域中分解
:::
```python
from Crypto.Util.number import *

c = 6213821885972957598682671714020013335408863255755419706556395400896297468146793182597800693069147754359933051135998086909457100567592698532245969194482119142450331519165775529775641738051671890307829051317859332039859825370003740172207413609314343847850170745031408906194699412708038331711695891109600261227061048345172217197566261450476739581298331463222371790187612685451942231866092
N = 18036379935649899281719719960900134329975732067841219773440376800149553496298696461303290259937812255563356277068919300440461912502580455765095286245121650
e = 65537

zn = ZZ[i](N)
for d in divisors(zn):
    p = int(d[0])
    q = int(d[1])
    if isPrime(p) and isPrime(q) and p.bit_length() > 250:
        break
n = p ** 2 * q ** 3
phi = (p - 1) * (q - 1) * q ** 2 * p
d = inverse(e,phi)
print(long_to_bytes(int(pow(c,d,n))))
#qqqy{th1s_i5_r34lly_Ring_0f_G4uss_integers}
```

:::tip[解法3]
当然你也可以慢慢试出来,不过需要注意谁是 $p$ ,谁是 $q$
:::
```python
from Crypto.Util.number import *  
  
c = 6213821885972957598682671714020013335408863255755419706556395400896297468146793182597800693069147754359933051135998086909457100567592698532245969194482119142450331519165775529775641738051671890307829051317859332039859825370003740172207413609314343847850170745031408906194699412708038331711695891109600261227061048345172217197566261450476739581298331463222371790187612685451942231866092  
N = 18036379935649899281719719960900134329975732067841219773440376800149553496298696461303290259937812255563356277068919300440461912502580455765095286245121650  
p = 93690424704840405256880569567004736912451772675700400671167376891014438404811  
q = 96221017736649044150977794536711908878756746657762100525114358908567992301173  
n = p ** 2 * q ** 3  
e = 0x10001  
phi = (p - 1) * (q - 1) * q ** 2 * p  
d = inverse(e, phi)  
m = pow(c, d, n)  
print(long_to_bytes(m))
#qqqy{th1s_i5_r34lly_Ring_0f_G4uss_integers}
```
---
# 题目-3

```python
from Crypto.Util.number import *  
  
flag = b"qqqy{******}"  
  
p = getPrime(128)  
q = getPrime(128)  
n = p ** 3 * q ** 2  
e = 65537  
N = p ** 4 + q ** 4  
m = bytes_to_long(flag)  
c = pow(m, e, n)  
  
print(f'c = {c}')  
print(f'N = {N}')  
  
'''  
c = 723001287047554777985898934484434293775936169427494647910346588774096149201632212920246077066229991416000429798113965615144176256115517548985323187757307731581725928470690864328890067737424657  
N = 6468107929669625403997848468514488873349032091942958802358881854541928892328764923800119006631669963369631183275215611733234022898446567601122943124085362  
'''
```

## 解题思路

+ 思路和上一题是一样的,把 $p^4+q^4$ 当做 $x^2+y^2$ 用自定义的`two_squares`函数求出所有可能的 $x$ 和 $y$ ,其中 $x$ 是 $p^2$ , $y$ 是 $q^2$
+ 随后遍历每一个解是否可以完全开方,如果可以则可尝试求解,注意 $p$ 和 $q$ 值的位置

## 解答

```python
from Crypto.Util.number import *  
from gmpy2 import *  
  
c = 723001287047554777985898934484434293775936169427494647910346588774096149201632212920246077066229991416000429798113965615144176256115517548985323187757307731581725928470690864328890067737424657  
N = 6468107929669625403997848468514488873349032091942958802358881854541928892328764923800119006631669963369631183275215611733234022898446567601122943124085362  
e = 65537  
  
def reps(n):  
    """Searching for all different representations n = S² + T², where n > 0 is an integer  
    """    sols = []  # and we append solutions sol one by one when found  
    first_prime, choices, R = True, [], GaussianIntegers()  
  
    for p, mul in factor(n):  
        if p == 2:  
            choices.append([(1 + i) ^ mul])  
        elif p % 4 != 1:  
            return []  
        else:  
            pp = R(p).factor()[0][0]  # first factor of p seen in ZZ[i]  
            if first_prime:  
                first_prime = False  
                choices.append([pp ^ mul])  
            else:  
                choices.append([pp ^ mul, pp.conjugate() ^ mul])  
    for choice in cartesian_product(choices):  
        S, T = R(prod(choice))  
        S, T = abs(S), abs(T)  
        if S > T:    S, T = T, S  
        if S in ZZ and T in ZZ:  # 转换为 int 类型  
            sols.append((ZZ(S), ZZ(T)))  
    sols.sort()  
    return sols  
  
combinations = reps(N)  
  
import math  
def square(s2):  
    root = math.isqrt(s2)  
    if root * root == s2:  
        return root  
    return None  
  
for p_2, q_2 in combinations:  
    sp, sq = square(p_2), square(q_2)  
    if sp is not None and sq is not None:  
        for p, q in [(sp, sq), (sq, sp)]:  
            n = p ** 3 * q ** 2  
            phi = (p-1)*(q-1)*p**2*q  
            try:  
                d = invert(e, phi)  
                flag = long_to_bytes(pow(c, d, n))  
                if b'qqqy' in flag:  
                    print(f"p = {p}, q = {q}")  
                    print(flag)  
                    break  
            except:  
                continue  
        else:  
            continue  
        break
#p = 249552721851710319143350208001269060941, q = 225586939552233771559052765154425888999
#qqqy{Seems you've already mastered the use of the 'two_squares'}
```
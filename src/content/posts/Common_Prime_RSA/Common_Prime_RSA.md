---
title: Common Prime RSA
published: 2025-02-20
pinned: false
description: 详细解析共素数 RSA 的构造原理、生成算法及多种攻击手段
tags: [Pollards'rho, Wiener, BSGS, CopperSmith]
category: Article
author: SevensNight
licenseName: "CC BY-NC-SA 4.0"
draft: false
date: 2025-02-20
image: "./1.png"
permalink: "common-prime-rsa"
---

# 情形
`gcd(p−1,q−1)=g`

分解的 $n$ 方法有四种:

(1)修改`Pollards'rho`方法分解 $n$

(2)知道`a`,`b`的值分解 $n$

(3)知道`g`的值分解 $n$

(4)分解`N-1`

# 简介

Wiener提出,如果 $p$ 和 $q$ 是素数,使得 $p−1$ 和 $q−1$ 有一个大数因子,那么具有这种性质的素数可以作为`Wiener Attack`的反制措施

根据这种理论,出现了一种 $p−1$ 和 $q−1$ 拥有一个共同的大素数因子的RSA变体,我们称作`共素数RSA`(Common Prime RSA)

对于某个大素数 $g$ ,让 $p=2ga+1$ 且 $q=2gb+1$ 作为平衡素数,保证 $a$ , $b$ 互素且 $h=2gab+a+b$ 是素数,第一个限制确保 $\gcd(p−1,q−1)=2g$ ,第二个限制确保 $(pq−1)/2=gh$ 与 $N=pq$ 的大小接近

因为由上述算法生成的素数 $p$ , $q$ 满足 $g=gcd(p−1,q−1)$ 是一个大素数因子,故称 $p$ , $q$ 为`共素数`(common primes),其中 $g$ 为这两个素数的`共因子`(common factor)

我们需要注意到对于共素数RSA有着以下性质:
$$\lambda(pq) = \text{lcm}(p - 1, q - 1) = \text{lcm}(2ga, 2gb) = 2gab$$ $$\varphi(pq) = (p - 1)(q - 1) = 2ga \cdot 2gb = 2g\lambda(pq)$$
此外存在额外定义,RSA加密指数和解密指数需要与 $λ(pq)$ 互素

根据上述定义,可以推导出
$$N = pq = (2ga + 1)(2gb + 1) = 2g(2gab + a + b) + 1 = 2gh + 1$$
即 $N-1$ 为
$$N-1=2g(2gab+a+b)=2gh$$
定义 $γ$ 表示共因子 $g$ 的相对于 $N$ 的大小,即 $g=N^γ$ ;考虑 $g≤N^{1/2}$ ,故 $0≤γ≤1/2$

# 生成算法

- @ γ取0.48
```python
from Crypto.Util.number import *
try:
    gcd
except NameError:
    from math import gcd

def gen_prime(nbits: int, gamma: float):
    g = getPrime(int(nbits * gamma))
    alpha = 0.5 - gamma
    while True:
        a = getRandomNBitInteger(int(alpha * nbits))
        p = 2 * g * a + 1
        if isPrime(p):
            b = getRandomNBitInteger(int(alpha * nbits))
            q = 2 * g * b + 1
            h = 2 * g * a * b + a + b
            while not isPrime(q) or isPrime(h) or gcd(a, b) != 1:
                b = getRandomNBitInteger(int(alpha * nbits))
                h = 2 * g * a * b + a + b
                q = 2 * g * b + 1
            return p, q
print(gen_prime(512, 0.48))
```
---
# 攻击
## γ接近于1/2

当 $γ$ 接近于`1/2`时, $g=N^γ$ 接近于 $N^{1/2}$ ,由于共素数RSA的特殊构造我们可以在 $O(N^{1/4−γ/2})$ 分解 $N$ ,故此时算法时间复杂度接近于 $O(1)$

此时我们只需修改`Pollard's rho method`的 $x_i$ 函数

在Mckee&Pinch的论文[《Further Attacks on Server-Aided RSA Cryptosystems》](https://citeseerx.ist.psu.edu/doc_view/pid/64294c404088b69a519614510b8d12b4809a6b10)中指出将 $f(x)=x^2+1$ 修改为 $f(x)=x^{N−1}+3 \pmod N$ 是最优解

由于 $N−1=2gh$ 且 $p−1=2ga$ ,故最多只有一个值不在 $x^{N−1} \bmod p$ 的环中

**算法实现如下:**

```python
from Crypto.Util.number import *
from gmpy2 import invert

f = lambda x,n: (pow(x, n - 1, n) + 3) % n
def phllard_rho(n):
    i = 1
    while True:
        a = getRandomRange(2, n)
        b = f(a, n)
        j = 1
        while True:
            p = GCD(abs(a - b), n)
            if p == n:
                break
            elif p > 1:
                return (p, n // p)
            else:
                a = f(a, n)
                b = f(f(b, n), n)
            j += 1
        i += 1

n = 
p,q = phllard_rho(n)
print(p)
print(q)
```

故事实证明 $γ$ 值的选取不能过于接近`1/2`

### 题目

:::CAUTION[题目来源]
羊城杯2021-easy_RSA
:::
```python
from Crypto.Util.number import *
from flag import flag
import gmpy2

def gen_prime(nbits, gamma):
    g = getPrime(int(nbits * gamma))  #491
    alpha = 0.5 - gamma  #0.02
    while True:
        a = getRandomNBitInteger(int(alpha * nbits))  #20
        p = 2 * g * a + 1
        if isPrime(p):
            b = getRandomNBitInteger(int(alpha * nbits))  #20
            q = 2 * g * b + 1
            h = 2 * g * a * b + a + b
            while not isPrime(q) or isPrime(h) or gmpy2.gcd(a, b) != 1:
                b = getRandomNBitInteger(int(alpha * nbits))
                q = 2 * g * b + 1
            return p, q

def encrypt(nbits, gamma):
    p, q = gen_prime(nbits, gamma)
    n = p * q
    e = getPrime(16)
    while gmpy2.gcd(e, gmpy2.lcm(p-1,q-1)) != 1:
        e = getPrime(16)
    m = bytes_to_long(flag)
    c = pow(m, e, n)
    return n, e, c

n, e, c = encrypt(1024, 0.48)
print 'n =', n
print 'e =', e
print 'c =', c

# n = 84236796025318186855187782611491334781897277899439717384242559751095347166978304126358295609924321812851255222430530001043539925782811895605398187299748256080526691975084042025794113521587064616352833904856626744098904922117855866813505228134381046907659080078950018430266048447119221001098505107823645953039
# e = 58337
# c = 13646200911032594651110040891135783560995665642049282201695300382255436792102048169200570930229947213493204600006876822744757042959653203573780257603577712302687497959686258542388622714078571068849217323703865310256200818493894194213812410547780002879351619924848073893321472704218227047519748394961963394668
```

#### 解题思路

##### 解1

+ `alpha = 0.5 - gamma` #$0.02$
+ $γ$ 接近`1/2`,可以直接尝试分解

##### 解2

+ [[老题新做] 羊城杯 2021 - Easy RSA 另解](https://zhuanlan.zhihu.com/p/435012704)
+ <img src="/images/Common_Prime_RSA/zh1.png" width="80%">

#### 解答

:::tip[解法1]
:::
```python
from Crypto.Util.number import *
from gmpy2 import invert

f = lambda x,n: (pow(x, n - 1, n) + 3) % n
def phllard_rho(n):
    i = 1
    while True:
        a = getRandomRange(2, n)
        b = f(a, n)
        j = 1
        while True:
            p = GCD(abs(a - b), n)
            if p == n:
                break
            elif p > 1:
                return (p, n // p)
            else:
                a = f(a, n)
                b = f(f(b, n), n)
            j += 1
        i += 1

n = 84236796025318186855187782611491334781897277899439717384242559751095347166978304126358295609924321812851255222430530001043539925782811895605398187299748256080526691975084042025794113521587064616352833904856626744098904922117855866813505228134381046907659080078950018430266048447119221001098505107823645953039
p,q = phllard_rho(n)
print(p)
#9983140483800634632426126985832058062766650402234684899412786169759602188949733747138853010482968306554808689182393249326088351886439191015684338347893201
print(q)
#8437905502983445042677582637893534375137565614989838462475696727313788501904161403475771835934720130340799646782932619714906025013322551788559197469878239

e = 58337
c = 13646200911032594651110040891135783560995665642049282201695300382255436792102048169200570930229947213493204600006876822744757042959653203573780257603577712302687497959686258542388622714078571068849217323703865310256200818493894194213812410547780002879351619924848073893321472704218227047519748394961963394668
n=p*q
phi = (p-1)*(q-1)
d = inverse(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
#SangFor{0a8c2220-4c1b-32c8-e8c1-adf92ec7678b}
```

:::tip[解法2]
:::

```python
from sage.groups.generic import bsgs

N = 84236796025318186855187782611491334781897277899439717384242559751095347166978304126358295609924321812851255222430530001043539925782811895605398187299748256080526691975084042025794113521587064616352833904856626744098904922117855866813505228134381046907659080078950018430266048447119221001098505107823645953039
e = 58337
c = 13646200911032594651110040891135783560995665642049282201695300382255436792102048169200570930229947213493204600006876822744757042959653203573780257603577712302687497959686258542388622714078571068849217323703865310256200818493894194213812410547780002879351619924848073893321472704218227047519748394961963394668

Zn = Zmod(N)

g = Zn(c)
one = Zn(1)

gg = g ^ ((N-1)^2)
k = bsgs(gg, one, bounds=(1, 2^40), operation='*')

phi = k * ((N-1)^2)

d = inverse_mod(e, phi)
m = pow(c, d, N)
print(bytes.fromhex(hex(m)[2:]))
#SangFor{0a8c2220-4c1b-32c8-e8c1-adf92ec7678b}
```

## 已知a,b

已知 $N=2g(2gab+a+b)+1$ ,于是我们构造方程
$4abg^2 + 2(a + b)g - N + 1 = 0$
可以在多项式时间 $log⁡(N)$ 内分解 $N$

**Sagemath代码如下:**

```python
a = 
b = 
N = 
P.<g> = ZZ[]
f = 4 * a * b * g ^ 2 + 2 * (a + b) * g - N + 1
g = f.roots()
if g:
    g = g[0][0]
    p = 2 * g * a + 1
    q = 2 * g * b + 1
    assert p * q == N
```

`Python`可以借助`sympy`解方程

## 已知g

当 $g≥a+b$ 时,会导致在多项式时间为 $log⁡(N)$ 内分解 $N$ ,同时因为素数是平衡的,条件相当于 $g>N^{1/4}$

证明如下:

我们假设 $g>a+b$ ,那么给予 $N$ , $g$ ,令 $M=(N−1)/(2g)$ , $c=a+b$ ,那么方程
$$N = 2g(2gab + a + b) + 1$$
可以改写成
$$M=2gab+c$$
因为 $c=a+b<g$ ,根据假设,可以归约为模 $g$ 域下的方程:
$$c \equiv M \pmod g$$
因此, $c=a+b$ 是已知的

将 $b=c−a$ 带回方程 $N=2g(2gab+a+b)+1$ ,整理可得二次方程:
$$2ga^2 - 2gca + \frac{N - 1}{2g} - c = 0$$
可以解得 $a$ , $b$ 为该方程两解

假设 $g=a+b$ ,我们将方程 $N=2g(2gab+a+b)+1$ 作等价替换,整理得到方程
$$\frac{N - 1}{4g^2} = ab + \frac{1}{2}$$
我们再进一步替换 $b=g−a$ ,再次整理可得二次方程:
$$a^2 - ga + \frac{N - 1}{4g^2} - \frac{1}{2} = 0$$
可以解得 $a$ , $b$

**代码如下:**

:::WARNING[$g>a+b$ 时]
:::
```python
g = 
N = 
M = (N - 1) // (2 * g)
c = M % g
P.<a> = ZZ[]
f = 2 * g * a ^ 2 - 2 * g * c * a + M - c
a = f.roots()
if a:
    a, b = a[0][0], a[1][0]
    p = 2 * g * a + 1
    q = 2 * g * b + 1
    assert p * q == N
```

:::WARNING[$g=a+b$ 时]
:::
```python
g = 
N = 
M = (N - 1) // (2 * g)
P.<a> = ZZ[]
f = 2 * a ^ 2 - 2 * g * a + (N - 1) // (2 * g ^ 2) - 1
a = f.roots()
if a:
    a, b = a[0][0], a[1][0]
    p = 2 * g * a + 1
    q = 2 * g * b + 1
    assert p * q == N
```

因为 $p=2ga+1$ ,注意到 $g>N^{1/4}$ 是已知的,故我们也可以用`Coppersmith's factoring`方法分解模数

而当 $g<a+b$ 时,我们可以使用时间复杂度为 $O(N^{1/4−γ})$ 的算法分解 $N$ ,每个操作的多项式时间为 $log⁡(N)$

**证明如下:**

已知 $g$ ,我们可以通过除法算法计算 $u$ 和 $0≤v≤2g$ ,例如:
$$\frac{N - 1}{2g} = 2gu + v$$
因为我们知道 $N=2g(2gab+a+b)+1$ ,于是乎
$$a+b=v+2gcab=u-c$$
其中 $c$ 为任意整数

对于任意与 $N$ 互素的整数 $x$ ,我们有
$$x^{u2g} \equiv x^{ab2g + c2g} \equiv x^{c2g} \pmod{N}$$
因为 $u=ab+c$ 且 $λ(N)=2gab$ ,所以 $x^{2gab} \equiv 1 \pmod N$

让 $y=x^{2g}$ ,我们有
$$y^u \equiv y^c \pmod{N}$$
根据这个关系,未知的 $c$ 可以用Shanks的`小步大步法(BSGS)`(baby-step giant-step methodology)求解,对于某些 $d>sqrt(c)$ ,我们计算得到大步为
$$y^0, y^d, y^{2d}, \cdots, y^{d^2} \bmod{N}$$
小步为
$$y^u, y^{u - 1}, y^{u - 2}, \cdots, y^{u - d} \bmod{N}$$
在其中搜索碰撞,将会产生一个 $r$ 和 $s$ 满足:
$$y^{rd} \equiv y^{u - s} \pmod{N}$$
其中 $c=rd+s$

当 $c$ 已知,我们可以计算 $a$ , $b$

计算,排序和搜索需要 $O(dlog⁡(d))$ 操作,其中 $d>sqrt(c)$

故使用这种算法需求 $γ$ 接近于`1/4`

多次跑这个算法,最终验证可得 $c$ 的大致范围大概率会落在 $N^{1/2−2γ}$ 的附近,取上下浮动两位大小最佳

**Sagemath代码如下:**

:::WARNING[$g<a+b$ 时]
:::
```python
from sage.groups.generic import bsgs

g = 
N = 
nbits = 1024
gamma = 0.23
cbits = ceil(nbits * (0.5 - 2 * gamma))

M = (N - 1) // (2 * g)
u = M // (2 * g)
v = M - 2 * g * u
GF = Zmod(N)
x = GF.random_element()
y = x ^ (2 * g)
# c的范围大概与N^(0.5-2*gamma)很接近
c = bsgs(y, y ^ u, (int(2**(cbits-1)), int(2**(cbits+1))))
ab = u - c
apb = v + 2 * g * c
P.<x> = ZZ[]
f = x ^ 2 - apb * x + ab
a = f.roots()
if a:
    a, b = a[0][0], a[1][0]
    p = 2 * g * a + 1
    q = 2 * g * b + 1
    assert p * q == N
```

### 题目1

:::CAUTION[题目来源]
强网杯2024
:::
```python
from Crypto.Util.number import long_to_bytes, bytes_to_long, getPrime
import random, gmpy2

class RSAEncryptor:
    def __init__(self):
        self.g = self.a = self.b = 0
        self.e = 65537
        self.factorGen()
        self.product()

    def factorGen(self):
        while True:
            self.g = getPrime(500)
            while not gmpy2.is_prime(2*self.g*self.a+1):
                self.a = random.randint(2**523, 2**524)
            while not gmpy2.is_prime(2*self.g*self.b+1):
                self.b = random.randint(2**523, 2**524)
            self.h = 2*self.g*self.a*self.b+self.a+self.b
            if gmpy2.is_prime(self.h):
                self.N = 2*self.h*self.g+1
                print(len(bin(self.N)))
                return

    def encrypt(self, msg):
        return gmpy2.powmod(msg, self.e, self.N)


    def product(self):
        with open('/flag', 'rb') as f:
            self.flag = f.read()
        self.enc = self.encrypt(self.flag)
        self.show()
        print(f'enc={self.enc}')

    def show(self):
        print(f"N={self.N}")
        print(f"e={self.e}")
        print(f"g={self.g}")


RSAEncryptor()
'''
N=51657999756690967186588996215664168497370486139760099988595414828727983779546605719940804807600702982441420573278857358283956576117953922473066432017592495133706729760422222891652753765512676564676681283098394548913387209196150332971723414216557817623554405430820579740222241707060798484488162959906554151628826649645549857376389514235605383200948637393805620922357497559575721372378043647085586958646623616279499301953828119839759155713210540465295077855783065483067730429116459612106943556564234959652876183429793248281482188133483319276230212777676735792371318110006476193874307484991785161682554109354412732317203
e=65537
g=2485123610764374014270789237614946556941781726543303674175119390795018685478874519905795106078406823435536131288458566170115665041363495335269709135811
C=28202679072153296346006816417382124529937666704182542518065303275976321831906094232804772404923511250416941784829263735008621187061575092462163699748934506898476841195128781938795842168820103035149075505083142014293446685272596151227631135157118425271040826931331389205822851376453576019854472679252746859939324841698162300853121273468883875556566200571290316887270568728688434714111270070758059040093516226853074913178501938759026695823416142154992551841347420935341846204890649806890263435571918894890106600252801255493750546432442678011345166162953964688073884233888980485821317850868322223277612229644994478304841
'''
```

#### 解题思路

+ 这个板子要求很严格需要满足 $γ$ 接近`1/4`,但是又不会相等

#### 解答

```python
from sage.groups.generic import bsgs

N=51657999756690967186588996215664168497370486139760099988595414828727983779546605719940804807600702982441420573278857358283956576117953922473066432017592495133706729760422222891652753765512676564676681283098394548913387209196150332971723414216557817623554405430820579740222241707060798484488162959906554151628826649645549857376389514235605383200948637393805620922357497559575721372378043647085586958646623616279499301953828119839759155713210540465295077855783065483067730429116459612106943556564234959652876183429793248281482188133483319276230212777676735792371318110006476193874307484991785161682554109354412732317203
e=65537
g=2485123610764374014270789237614946556941781726543303674175119390795018685478874519905795106078406823435536131288458566170115665041363495335269709135811

nbits = int(N).bit_length()
gamma = 500/nbits   #这边的500对应g的比特位数
cbits = ceil(nbits * (0.5 - 2 * gamma))

M = (N - 1) // (2 * g)
u = M // (2 * g)
v = M - 2 * g * u
GF = Zmod(N)
x = GF.random_element()
y = x ^ (2 * g)
# c的范围大概与N^(0.5-2*gamma)很接近
c = bsgs(y, y ^ u, (2**(cbits-1), 2**(cbits+1)), operation='*')
#(a, b, bounds, operation='*', identity=None, inverse=None, op=None)
ab = u - c
apb = v + 2 * g * c
P.<x> = ZZ[]
f = x ^ 2 - apb * x + ab
a = f.roots()
if a:
    a, b = a[0][0], a[1][0]
    p = 2 * g * a + 1
    q = 2 * g * b + 1
    assert p * q == N
print(p)
#244604694627076648489210365664102239174482733462537432712407910006835446239176538374156243495175468594615136872212393760698477350317275474971321387194980168454743272587743216146965397629119246475941520010250819322175260213109200341134093278266148881092572196138947268162112484996359512055579950394621791916231
print(q)
#211189731396809654956748434967535783554866474302187623992751419704200318704677817308617426901963513265584458292504626906029599467349497928619024732109772355930442220327326238724413378708011769600114627174054061255194718977342791539965748023272653976490685226657717425326828603761550107833175151579721581360213
```
---
```python
from Crypto.Util.number import *

p = 244604694627076648489210365664102239174482733462537432712407910006835446239176538374156243495175468594615136872212393760698477350317275474971321387194980168454743272587743216146965397629119246475941520010250819322175260213109200341134093278266148881092572196138947268162112484996359512055579950394621791916231
q = 211189731396809654956748434967535783554866474302187623992751419704200318704677817308617426901963513265584458292504626906029599467349497928619024732109772355930442220327326238724413378708011769600114627174054061255194718977342791539965748023272653976490685226657717425326828603761550107833175151579721581360213
e = 65537
c = 28202679072153296346006816417382124529937666704182542518065303275976321831906094232804772404923511250416941784829263735008621187061575092462163699748934506898476841195128781938795842168820103035149075505083142014293446685272596151227631135157118425271040826931331389205822851376453576019854472679252746859939324841698162300853121273468883875556566200571290316887270568728688434714111270070758059040093516226853074913178501938759026695823416142154992551841347420935341846204890649806890263435571918894890106600252801255493750546432442678011345166162953964688073884233888980485821317850868322223277612229644994478304841

n=p*q
phi = (p-1)*(q-1)
d = inverse(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
#flag{2e856eb0-bdfc-42bb-afe6-ec3a02886c60}
```

### 题目2

:::CAUTION[题目来源]
天一永安杯2023
:::
```python
from Crypto.Util.number import *
from math import gcd
from secret import flag

def gen_key(nbits, gamma):
    g = getPrime(int(nbits * gamma)) 
    alpha = 0.5 - gamma
    while True:
        a = getPrime(int(alpha * nbits))
        p = 2 * g * a + 1 
        if isPrime(p):
            break
    while True:
        b = getRandomNBitInteger(int(alpha * nbits))
        q = 2 * g * b + 1
        h = 2 * g * a * b + a + b
        if isPrime(q) and isPrime(h) and gcd(a, b) == 1:
            return p*q,a,g
        else:
            continue
        
n,a,g = gen_key(1024, 0.05)
e = 65537
c = pow(bytes_to_long(flag),e,a*g)
print(n,c,a)

'''
n=36535558847082719901201561031181835346574576610950713924924272947759193576365817762980927638691696601293089537315055413746788190208875234794229119049056299551864869870291634941246362436491006904347559559494705922259007299126640817275929491680601926404543198957206717290905220235571289759182878331893962038379
c=532997872940452282189043430008002793694788439822465302532208754231005799057972378308576109082463996551992533174546386979606697890310597738637156771564229
a=2694858406312563434474553988904403597551484373358339092528913028454100111881368126493990657117571672510331411186745639563619323775673115439
'''
```

#### 解题思路

+ 乍一看我们只知道 $a$
+ 题目代码`n = p*q = 2g(a+b) + 4ab*g**2 +1`
+ 而`a+b+2gab == h`
+ 化简得到 $p*q-1 = 2gh$
+ 我们可以考虑用 $p*q-1 = 2gh$ 分解得到 $g$
	$gh = (n-1) // 2$
+ 因为 $g$ 是`51`位的
	    $h$ 是约为`972`位的
+ 相差很大可以用yafu分解或者factordb查一下
+ 分解得到

```python
g = 1346104232461691
h = 13570850594633462506426369052182298554140635599543685835372377476383038708650421475723391142118956001358520246769650699398490037618758005241062608387057439283872260149565854577827352267289963736282502923131251179400580891491236925451166755184695335564693793568286112036468975877609637392241679
```

+ 本题的公钥是`(e,a*g)`,所以直接就把 $ag$ 当成 $pq$

#### 解答

```python
from Crypto.Util.number import *
import gmpy2

c = 532997872940452282189043430008002793694788439822465302532208754231005799057972378308576109082463996551992533174546386979606697890310597738637156771564229
a = 2694858406312563434474553988904403597551484373358339092528913028454100111881368126493990657117571672510331411186745639563619323775673115439
g = 1346104232461691
e = 65537

d = gmpy2.invert(e,(g-1)*(a-1))
print(long_to_bytes(pow(c,d,a*g)))
#flag{p01la4d_rHo_a1gOr1thM_r1gh4}
```

### 题目3

:::CAUTION[题目来源]
MRCTF2021-Common_Prime_RSA
:::
```python
from Crypto.Util.number import *
from secret import flag

def get_my_prime(nibt, gamma):
    g = getPrime(int(nibt * gamma))
    while True:
        p = 2 * g * getPrime(int(nibt * (0.5 - gamma))) + 1
        if isPrime(p):
            break

    while True:
        q = 2 * g * getPrime(int(nibt * (0.5 - gamma))) + 1
        if isPrime(q):
            break

    assert 2 * p > q and 2 * q > p
    return p, q, g

p1, q1, g1 = get_my_prime(1024, 0.2247)
p2, q2, g2 = get_my_prime(1024, 0.3247)
n1 = p1 * q1
n2 = p2 * q2

print(hex(n1))
# 0x48b11209b62c5bc580d00fc94886272b92814ce35fcd265b2915c6917a299bc54c2c0603c41f8bf7c8f6f2a545eb03d38f99ec995bf6658bb1a2d23056ee21c7230caa2decec688ea9ee00b0d50b39e8cd23eb2c3ddeb20f5ab26777b80052c171f47b716e72f6aee9cece92776fc65119046f9a1ad92c40e2094d7ed7526d49

print(hex(pow(bytes_to_long(b'Common prime RSA is a variant of RSA' + long_to_bytes(g1) + b'And the common factor g is large prime and p=2ga+1 q=2gb+1'), 3, n1)))
# 0x27d8d7249643668ffc115be8b61775c60596e51f6313b47ad5af8493526922f5e10026a2cdaef74e22c3eec959dd8771abe3495b18d19f97623f5a3f65f22ff8fc294fc37ceb3b43ebbbf8a9bcf622922e22c5520dbd523483b9dc54fdffcd1a1b3f02ca1f53b75413fb79399ca00034f2acf108ac9a01bd24d2b9df6e27d156

print(hex(pow(g2, 65537, n1)))
# 0xeaf06b9050a809659f962251b14d6b93009a7010f0e8d8f0fa4d71591757e98243b8ff50ec98a4e140fd8a63bbb4b8bb0a6d302a48845b8b09d1e40874fcb586ddccbb0bbf86d21540ec6c15c1d2bf925942f6f384fdc1baae7f8e06150ccd9459eb65d0f07eea16a911fa0a17e876a145dbfec83537ca2bee4641897b9f7f5

print(hex(n2))
# 0x6d457110d6044472d786936acbd3cd93c7728daa3343b35ccaa5c55eba6b35c28c831bb245b8cdd8fc8cb67a72f57e62a0e1259f5e804c487a8478f6895b302d39277bd73947598a5f8ec0a535be9e9a4d34df91df948ee44cc3d13d14e23b9651089e4767c7f0e7245df55619c92fe24483225d35f5f3ee6f74375065766ffd

print(hex(pow(bytes_to_long(flag.encode()), 65537, n2)))
# 0x15be2b0eaef8837a753587c47d3f31696a7d239d88837a9b7d903cd0d0648ef8e225ea555402693a23f305d19e7e13905be61b44c651dba5b26614bcf876234e765a724e0ed8af4a4e408e6a233c48ab9cc63e9c552ef9cd1999512aa0aca830fe6cbcbcc3c6bb354903124a2c3a12d442cdbdefdae6576f4bbc1515051b7111
```

#### 解题思路

+ 题目给出了一个`明文+g1+明文段`的内容,考虑用`CopperSmith`来解
+ 相当于知道了 $m$ 的部分高位低位,因此可以得到如下值

```python title:bytes_to_long
m_low = b"And the common factor g is large prime and p=2ga+1 q=2gb+1"
m_low_int = int.from_bytes(m_low, byteorder='big')
print(m_low_int)
m_high = b"Common prime RSA is a variant of RSA"
m_high_int = int.from_bytes(m_high+b'\x00'*87, byteorder='big')
print(m_high_int)
#12174832913272944860601983973507591320681689815583717341813397700955082069528318044500277669230782878838402371536356670567072055281703856945
#43068805484541415698874685945122116488177521029738607414688723817811466178438704211475601610458271809578314787221337437676782823427096603325480109722746064453605749460332117411578252753615112132108843194498669812000013922027642492460715110657531599266817556380763143511900612854154688377602965504
```

:::note[为什么要乘以`87`个`\x00`?]
:::
```python
g1=getPrime(int(1024*0.2247))
l=long_to_bytes(g1)
m_low = b'And the common factor g is large prime and p=2ga+1 q=2gb+1'
print(len(l)+len(m_low))
#87
```

+ 换成了首一多项式在`sage`里跑就可以得到了 $g1$

```python
n = 0x48b11209b62c5bc580d00fc94886272b92814ce35fcd265b2915c6917a299bc54c2c0603c41f8bf7c8f6f2a545eb03d38f99ec995bf6658bb1a2d23056ee21c7230caa2decec688ea9ee00b0d50b39e8cd23eb2c3ddeb20f5ab26777b80052c171f47b716e72f6aee9cece92776fc65119046f9a1ad92c40e2094d7ed7526d49
e = 3
c = 0x27d8d7249643668ffc115be8b61775c60596e51f6313b47ad5af8493526922f5e10026a2cdaef74e22c3eec959dd8771abe3495b18d19f97623f5a3f65f22ff8fc294fc37ceb3b43ebbbf8a9bcf622922e22c5520dbd523483b9dc54fdffcd1a1b3f02ca1f53b75413fb79399ca00034f2acf108ac9a01bd24d2b9df6e27d156
m_low = 12174832913272944860601983973507591320681689815583717341813397700955082069528318044500277669230782878838402371536356670567072055281703856945#464位
m_high = 43068805484541415698874685945122116488177521029738607414688723817811466178438704211475601610458271809578314787221337437676782823427096603325480109722746064453605749460332117411578252753615112132108843194498669812000013922027642492460715110657531599266817556380763143511900612854154688377602965504
PR.<x> = PolynomialRing(Zmod(n))
f = (m_low+m_high+x*2**464)^e - c
f = f.monic() 
g1 = f.small_roots(X=2**232,beta=0.4,epsilon=0.04)[0]
print(g1)
#1328458990599515056771144217738449144496664370133586446617480019409757
```

+ 已知 $g1$ ,接下来考虑分解 $n1$
+ 因为 $N = p \cdot q = (2ag + 1)(2bg + 1) = 4abg^2 + 2g(a + b) + 1$ ,所以 $\frac{N - 1}{2g} = 2gab + (a + b)$
+ 由于 $γ=0.2247<0.5$ 导致 $g<a,b$
+ 我们假设 $\frac{N - 1}{2g} = 2gu + v$ ,则 $v = a + b - 2gc$ , $u = ab + c$
+ 那么 $x^{u2g} \equiv x^{ab2g + c2g} \equiv x^{c2g} \pmod{N}$ ,即 $x^{2g^u} = x^{2g^c}$
+ 所以我们可以使用`BSGS`算法来得到 $c$
+ 因为题目中 $p$ 与 $q$ 较为接近,所以上述的 $a$ 与 $b$ 也比较接近
+ 我们知道 $a \cdot b \approx u \approx \frac{N}{(2 \cdot g_1)^2}$ ,根据对勾函数的性质, $x \approx y \in (\sqrt{u}, \sqrt{2u})$ ,随后即可得到 $c$
+ 随后即可得到 $c$ 的大概区间

**参考:**

[Writeup for MRCTF2021 crypto](https://dawn-whisper.top/2021/04/16/Wp_for_mrctf2021/)
[WriteUps of MRCTF2021(Crypto)](https://d33b4t0.com/MRCTF2021WP/)

#### 解答

```python
from Crypto.Util.number import *
from gmpy2 import *

n1 = 0x48b11209b62c5bc580d00fc94886272b92814ce35fcd265b2915c6917a299bc54c2c0603c41f8bf7c8f6f2a545eb03d38f99ec995bf6658bb1a2d23056ee21c7230caa2decec688ea9ee00b0d50b39e8cd23eb2c3ddeb20f5ab26777b80052c171f47b716e72f6aee9cece92776fc65119046f9a1ad92c40e2094d7ed7526d49
c1 = 0x27d8d7249643668ffc115be8b61775c60596e51f6313b47ad5af8493526922f5e10026a2cdaef74e22c3eec959dd8771abe3495b18d19f97623f5a3f65f22ff8fc294fc37ceb3b43ebbbf8a9bcf622922e22c5520dbd523483b9dc54fdffcd1a1b3f02ca1f53b75413fb79399ca00034f2acf108ac9a01bd24d2b9df6e27d156
e1 = 3

'''
kbits = int(1024*0.2247)
m0 =  0x436f6d6d6f6e207072696d652052534120697320612076617269616e74206f66205253410000000000000000000000000000000000000000000000000000000000416e642074686520636f6d6d6f6e20666163746f722067206973206c61726765207072696d6520616e6420703d3267612b3120713d3267622b31
PR.<x> = PolynomialRing(Zmod(n))
f = ((m0 + x*2**464)^e1) - c1
f = f.monic()
g1 = f.small_roots(X=2^kbits,beta=1)[0]
print(g1)
'''

g1 = 1328458990599515056771144217738449144496664370133586446617480019409757
v1 = ((n1 - 1) // (2*g1)) % (2*g1)
u1 = ((n1 - 1) // (2*g1)) // (2*g1)
left = (((2 * iroot(n1,2)[0]) // (2*g1)) - v1) // (2*g1)
right = (((3 * iroot(2*n1,2)[0]) // (4*g1)) - v1) // (2*g1)

dic = {}
b = pow(114514,2*g1,n1)
base = pow(b,left,n1)
D = iroot(right - left,2)[0]+1
step = pow(b,D,n1)
for i in range(D):
    dic[base] = i
    base = base * step % n1
print("baby step ready")

base = pow(b,u1,n1)
step = inverse(b,n1)
for i in range(D):
    if(base in dic):
        print("ans found!")
        print(i,dic[base])
        c = left+ i + D * dic[base]
        break
    base = base * step % n1

A = u1 - c
B = v1 + c * 2 * g1
C = iroot(B**2 - 4*A,2)[0]
x = (B+C) // 2
y = B-x
p1 = x*g1*2+1
q1 = y*g1*2+1
assert p1 * q1 == n1
phi1 = (p1-1) * (q1-1)
e1 = 65537
d1 = inverse(e1,phi1)
c1 = 0xeaf06b9050a809659f962251b14d6b93009a7010f0e8d8f0fa4d71591757e98243b8ff50ec98a4e140fd8a63bbb4b8bb0a6d302a48845b8b09d1e40874fcb586ddccbb0bbf86d21540ec6c15c1d2bf925942f6f384fdc1baae7f8e06150ccd9459eb65d0f07eea16a911fa0a17e876a145dbfec83537ca2bee4641897b9f7f5
g2 = pow(c1,d1,n1)

n2 = 0x6d457110d6044472d786936acbd3cd93c7728daa3343b35ccaa5c55eba6b35c28c831bb245b8cdd8fc8cb67a72f57e62a0e1259f5e804c487a8478f6895b302d39277bd73947598a5f8ec0a535be9e9a4d34df91df948ee44cc3d13d14e23b9651089e4767c7f0e7245df55619c92fe24483225d35f5f3ee6f74375065766ffd
c2 = 0x15be2b0eaef8837a753587c47d3f31696a7d239d88837a9b7d903cd0d0648ef8e225ea555402693a23f305d19e7e13905be61b44c651dba5b26614bcf876234e765a724e0ed8af4a4e408e6a233c48ab9cc63e9c552ef9cd1999512aa0aca830fe6cbcbcc3c6bb354903124a2c3a12d442cdbdefdae6576f4bbc1515051b7111
e2 = 65537

A = ((n2 - 1) // (2*g2)) // (2*g2)
B = ((n2 - 1) // (2*g2)) % (2*g2)
C = iroot(B**2 - 4*A,2)[0]
x = (B+C) // 2
y = B-x
p2 = x*g2*2+1
q2 = y*g2*2+1
assert p2 * q2 == n2
phi2 = (p2-1) * (q2-1)
d2 = inverse(e2,phi2)
m = pow(c2,d2,n2)
flag = long_to_bytes(m)
print(flag)
#i=5980588 k=698170
#MRCTF{k33p1ng_th3_C0mm0M_f@ct0r_g_C0ncea1ed_@t_A11_t1m3s_is_Imp0rtant}
```

## 分解N−1

当 $γ$ 过小,即 $g=N^γ$ 过小时,因为已知 $N−1=2gh$ ,故分解出 $g$ 是较为容易的

可以使用`yafu`分解 $N−1/2$ ,其中当 $γ$ 值约为`0.10`左右时分解迅速

## Mumtaz-Luo攻击

[Common Prime RSA 笔记](https://hasegawaazusa.github.io/common-prime-rsa.html#mumtaz-luo%E6%94%BB%E5%87%BB)

由已知,得
$$
\begin{cases} ed = (p - 1)bk + 1 \\ ed = (q - 1)ak + 1 \end{cases}
$$
可以变换为
$$
\begin{cases} ed - 1 + bk = pbk \\ ed - 1 + ak = qak \end{cases}
$$
两式相乘,可得
$$
(ed - 1 + bk)(ed - 1 + ak) = pbk \cdot qak = abk^2N
$$
展开得到完整式
$$
e^2d^2 + ed(ak + bk - 2) - abk^2(N - 1) - ak - bk + 1 = 0
$$
不妨构建多项式函数
$$
f(x, y, z) = e^2x^2 + ex(y + z - 2) - (y + z - 1) - (N - 1)yz
$$
其中特解 $(x^*, y^*, z^*) = (d, ak, bk)$ ,边界为
$$
\begin{cases} |x^*| \leq N^\delta \\ |y^*| \leq N^{\delta - \gamma + 0.5} \\ |z^*| \leq N^{\delta - \gamma + 0.5} \end{cases}
$$
其中, $\delta$ 是私钥 $d$ 的大小

## Ellen Jochemsz和Alexander May攻击

`john and may`方法是一种针对特定RSA变种的高级密码分析技术,主要利用`多项式的小根技术`(Coppersmith方法)和`格基约简`(LLL算法)来恢复私钥参数;这种方法特别适用于某些结构化的RSA变种,例如`Common Prime RSA`和`RSA-CRT`(中国剩余定理优化的RSA)

### 攻击方法的核心思想

##### 多项式构造

+ 通过分析RSA的数学结构,构造一个多项式,使其具有小根,这些小根与RSA的私钥参数相关
+ 例如,在`Common Prime RSA`中,私钥参数 $d$ 满足某些特定的数学关系,可以用来构造多项式

##### 移位多项式和格基生成

+ 通过移位操作生成一系列多项式,并构建一个格基,这些多项式被设计为在特定条件下具有小根
+ 使用`格基约简`算法(如LLL算法)对格基进行处理,以找到这些小根

##### 恢复私钥参数

+ 通过求解多项式的小根,恢复私钥参数 $d$
+ 在某些情况下,还需要通过进一步的代数运算(如求解结果式)来逐步恢复其他相关参数

### 攻击的适用场景

+ `Common Prime RSA`:在这种变种中,RSA的模数 $n=pq$ 的构造方式使得 $p−1$ 和 $q−1$ 共享一个大素数因子 g ;这种结构使得私钥 $d$可能被恢复
+ `RSA-CRT`:在某些优化的RSA解密过程中,私钥参数 $dp$ 和 $dq$ 的构造方式可能引入安全漏洞

### 攻击的实现步骤

##### 参数初始化

+ 根据RSA的结构,计算相关的参数 $γ$ 和 $δ$ ,分别表示 $g$ 和 $d$ 的大小
+ 选择合适的参数 $m$ 和 $τ$ ,用于生成移位多项式

##### 多项式和格基生成

+ 构造多项式 $f(x,y,z)$ ,并生成移位多项式
+ 构建格基矩阵,并使用`LLL算法`进行约简

##### 求解小根

+ 通过格基约简得到的多项式组合,求解小根
+ 使用结果式(resultant)逐步消除变量,最终恢复私钥参数

### 题目

:::CAUTION[题目来源]
祥云杯2022-common_rsa
:::
```python
from Crypto.Util.number import getPrime, isPrime, bytes_to_long, inverse
from math import lcm
from secret import flag

def gen(g):
    bits = 512 - g.bit_length()
    while True:
        a = getPrime(bits)
        p = 2 * a * g + 1
        if isPrime(p):
            return p

flag = bytes_to_long(flag)
g = getPrime(320)
p = gen(g)
q = gen(g)
n = p * q
d = getPrime(135)
phi = lcm(p - 1, q - 1)
e = inverse(d, phi)
c = pow(flag, e, n)
print("n = {}".format(n))
print("e = {}".format(e))
print("c = {}".format(c))
'''
n = 253784908428481171520644795825628119823506176672683456544539675613895749357067944465796492899363087465652749951069021248729871498716450122759675266109104893465718371075137027806815473672093804600537277140261127375373193053173163711234309619016940818893190549811778822641165586070952778825226669497115448984409
e = 31406775715899560162787869974700016947595840438708247549520794775013609818293759112173738791912355029131497095419469938722402909767606953171285102663874040755958087885460234337741136082351825063419747360169129165
c = 97724073843199563126299138557100062208119309614175354104566795999878855851589393774478499956448658027850289531621583268783154684298592331328032682316868391120285515076911892737051842116394165423670275422243894220422196193336551382986699759756232962573336291032572968060586136317901595414796229127047082707519
'''
```

#### 解题思路

##### 解1

O(∩_∩)O哈哈~

##### 解2

套用这个脚本
[crypto-attacks/attacks/rsa/wiener_attack_common_prime.py](https://github.com/jvdsn/crypto-attacks/blob/5c7989ceac599f1f8e016b5afb0d2966759cd470/attacks/rsa/wiener_attack_common_prime.py)

#### 解答

:::tip[解法1]
:::
```python
#n可以直接在在线网站分解
#http://www.factordb.com/
from Crypto.Util.number import *
from math import lcm

p = 12080882567944886195662683183857831401912219793942363508618874146487305963367052958581455858853815047725621294573192117155851621711189262024616044496656907
q = 21007149684731457068332113266097775916630249079230293735684085460145700796880956996855348862572729597251282134827276249945199994121834609654781077209340587

e = 31406775715899560162787869974700016947595840438708247549520794775013609818293759112173738791912355029131497095419469938722402909767606953171285102663874040755958087885460234337741136082351825063419747360169129165
c = 97724073843199563126299138557100062208119309614175354104566795999878855851589393774478499956448658027850289531621583268783154684298592331328032682316868391120285515076911892737051842116394165423670275422243894220422196193336551382986699759756232962573336291032572968060586136317901595414796229127047082707519

n=p*q
phi = lcm(p-1)*(q-1) #lcm加不加都能解出来
d = inverse(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
#flag{9aecf8d8-6966-4ffa-96b0-2e744d28baf2}
```

:::tip[解法2]
预期解(不会,就放个脚本在这里)
:::
```python
import logging
import os
import sys
from math import log
from math import sqrt

from sage.all import RR
from sage.all import ZZ
from Crypto.Util.number import long_to_bytes
path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(os.path.abspath(__file__)))))
if sys.path[1] != path:
    sys.path.insert(1, path)

from shared.small_roots import jochemsz_may_integer

def attack(N, e, delta=0.25, m_start=1):
    """
    Recovers the prime factors of a modulus and the private exponent if the private exponent is too small (Common Prime RSA version).
    More information: Jochemsz E., May A., "A Strategy for Finding Roots of Multivariate Polynomials with New Applications in Attacking RSA Variants" (Section 5)
    :param N: the modulus
    :param e: the public exponent
    :param delta: a predicted bound on the private exponent (d < N^delta) (default: 0.25)
    :param m_start: the m value to start at for the small roots method (default: 1)
    :return: a tuple containing the prime factors of the modulus and the private exponent
    """
    gamma = 1 - log(e, N)
    assert delta <= 1 / 4 * (4 + 4 * gamma - sqrt(13 + 20 * gamma + 4 * gamma ** 2)), "Bound check failed."

    x, y, z = ZZ["x, y, z"].gens()

    f = e ** 2 * x ** 2 + e * x * (y + z - 2) - (y + z - 1) - (N - 1) * y * z

    X = int(RR(N) ** delta)
    Y = int(RR(N) ** (delta + 1 / 2 - gamma))
    Z = int(RR(N) ** (delta + 1 / 2 - gamma))
    W = int(RR(N) ** (2 + 2 * delta - 2 * gamma))

    m = m_start
    while True:
        for t in range(m + 1):
            logging.info(f"Trying m = {m}, t = {t}...")
            strategy = jochemsz_may_integer.ExtendedStrategy([t, 0, 0])
            for x0, y0, z0 in jochemsz_may_integer.integer_multivariate(f, m, W, [X, Y, Z], strategy):
                d = x0
                ka = y0
                kb = z0
                if pow(pow(2, e, N), d, N) == 2:
                    p = (e * d - 1) // kb + 1
                    q = (e * d - 1) // ka + 1
                    return p, q, d

        m += 1

n = 253784908428481171520644795825628119823506176672683456544539675613895749357067944465796492899363087465652749951069021248729871498716450122759675266109104893465718371075137027806815473672093804600537277140261127375373193053173163711234309619016940818893190549811778822641165586070952778825226669497115448984409
e = 31406775715899560162787869974700016947595840438708247549520794775013609818293759112173738791912355029131497095419469938722402909767606953171285102663874040755958087885460234337741136082351825063419747360169129165
c = 97724073843199563126299138557100062208119309614175354104566795999878855851589393774478499956448658027850289531621583268783154684298592331328032682316868391120285515076911892737051842116394165423670275422243894220422196193336551382986699759756232962573336291032572968060586136317901595414796229127047082707519
delta = 0.132
print(delta)
p, q, d = attack(n, e, delta)
print(long_to_bytes(pow(c, d, n))) 
#flag{9aecf8d8-6966-4ffa-96b0-2e744d28baf2}
```

- 和上面那个差不多,逻辑都一样

```python
#Sage

# the following attack is due to Ellen Jochemsz and Alexander May
# see https://www.iacr.org/archive/asiacrypt2006/42840270/42840270.pdf

gamma = 320/1024
delta = 135/1024
m = 2
tau = (1 / 2 + gamma - 4 * delta) / (2 * delta)
t = ZZ(floor(tau * m))

X = ZZ(floor(n ^ delta))
Y = ZZ(floor(n ^ (delta + 1 / 2 - gamma)))
Z = ZZ(floor(n ^ (delta + 1 / 2 - gamma)))
W = ZZ(floor(n ^ (2 + 2 * delta - 2 * gamma)))
R = W * X ^ (2 * (m - 1) + t) * (Y * Z) ^ (m - 1)

# assert X ^ (7 + 9 * tau + 3 * tau ^ 2) * (Y * Z) ^ (5 + 9 * tau / 2) < W ^ (3 + 3 * tau)

P = PolynomialRing(ZZ, 'x,y,z')
x,y,z = P.gens()

# we know that ed = k(2gab) + 1 = k(p - 1)b + 1 = ka(q - 1) + 1
# we can multiply the last two expressions to get a semi-symmetric equation for
# (ed)^2, of which we want to find its roots
f = e^2 * x^2 + e * x * (y + z - 2) - (n - 1) * y * z - (y + z - 1)
assert f.constant_coefficient() == 1

M = set()
S = set()
# generate monomials
# S contains monomials of f^{m - 1} with x-shifts
# M contains monomials of f^{m} with x-shifts \setminus S
for i3 in range(0, m):
    for i2 in range(0, m):
        for i1 in range(0, 2 * (m - 1) - (i2 + i3) + t + 1):
            S.add(x ^ i1 * y ^ i2 * z ^ i3)
for i3 in range(0, m + 1):
    for i2 in range(0, m + 1):
        for i1 in range(0, 2 * m - (i2 + i3) + t + 1):
            M.add(x ^ i1 * y ^ i2 * z ^ i3)
M_S = M - S
M_S = sorted(M_S)
S   = sorted(S)
M   = sorted(M)

# use a dict to map each shift polynomial with its lowest order monomial to
# make diagonalizing the basis matrix easier
g   = {}

# generate shift polynomials
# the shift polynomials are generated with a polynomial derived from f (mod R)
# namely ff = a0^{-1} * f (mod R) such that the constant term of ff is 1
# i am fairly certain any polynomial with constant term 1 and the correct roots
# can be used here, although i have only tested it with ff and f
ff = f.change_ring(Zmod(R)).change_ring(ZZ)
for mono in S:
    i1, i2, i3 = mono.degree(x), mono.degree(y), mono.degree(z)
    fn = mono * ff(x, y, z) * X ^ (2 * (m - 1) + t - i1) * Y ^ (m - 1 - i2) * Z ^ (m - 1 - i3)
    fn = expand(fn(x * X, y * Y, z * Z))
    g[mono] = fn
for mono in M_S:
    fn = R * mono
    fn = expand(fn(x * X, y * Y, z * Z))
    g[mono] = fn

npolys = len(g)
nmonos = len(M)
print("polynomials: {}".format(npolys))
print("monomials:   {}".format(nmonos))
assert npolys == nmonos

B = Matrix(ZZ, npolys, nmonos)
C = Matrix(ZZ, npolys, nmonos)

for row, mono in enumerate(M):
    i1, i2, i3 = mono.degree(x), mono.degree(y), mono.degree(z)
    for c, mono_ in g[mono]:
        col = M.index(mono_)
        C[row, col] = 1
        B[row, col] = c

    # assert that diagonal elements are what they should be
    idx = M.index(mono)
    if mono in S:
        assert B[idx, idx] == X ^ (2 * (m - 1) + t) * (Y * Z) ^ (m - 1)
    elif mono in M_S:
        assert B[idx, idx] == R * X ^ i1 * Y ^ i2 * Z ^ i3
    else:
        raise Exception("what")

print(C.str())

# assert triangular form
for col in range(nmonos):
    for row in range(col + 1, npolys):
    # for row in xrange(col):
        assert B[row, col] == 0
    assert B[col, col] != 0

print("LLL...")
BB = B.LLL(algorithm='fpLLL:proved', fp='rr')
CC = Matrix(ZZ, npolys, nmonos)
for row in range(npolys):
    for col in range(nmonos):
        if BB[row, col] != 0:
            CC[row, col] = 1
print(CC.str())

# helper to construct a polynomial from coefficients
def topoly(r):
    RR = PolynomialRing(QQ, 'x,y,z')
    pol = 0
    for col in range(nmonos):
        pol += r[col] * M[col]
    pol = RR(pol(x / X, y / Y, z / Z))
    for c, _ in pol:
        assert c.is_integer()
    return P(pol)

# pull out h1, h2
hv = [expand(topoly(r)) for r in BB]
h1, h2 = hv[0:2]

# at some point we need to polynomial engines to something that can solve for
# roots, the default univariate engine works
s, = PolynomialRing(ZZ, 's').gens()

# these should be algebraically independent
assert h1.gcd(f).degree() == 0
assert h2.gcd(f).degree() == 0
assert h1.gcd(h2).degree() == 0

# take care that resultants are computed with f and not ff, which is a
# polynomial mod R
# these resultants eliminate z
h1x = h1.resultant(f, z)
h2x = h2.resultant(f, z)
hh  = h1.resultant(h2, z)

# this eliminates y
hy = h1x.resultant(h2x, y)

# now we can solve for roots via back substitution
d = []
for r, m in hy(x=s).roots():
    if r == 0:
        continue
    d.append(r)
assert len(d) == 1
d = d[0]

ka = []
for r, m in hh(x=d, y=s).roots():
    if r == 0:
        continue
    ka.append(r)
# f(x, y, z) = f(x, z, y) so we should have two solutions here
assert len(ka) == 2
ka = ka[0]

kb = []
for r, m in f(x=d, y=ka, z=s).roots():
    if r == 0:
        continue
    kb.append(r)
assert len(kb) == 1
kb = kb[0]

print("found d  = {}".format(d))
print("found ka = {}".format(ka))
print("found kb = {}".format(kb))

k = gcd(ka, kb)
a = ka // k
b = kb // k
g = (e * d - 1) // (2 * k * a * b)
p = 2 * g * a + 1
q = 2 * g * b + 1

from Crypto.Util.number import *
n = 253784908428481171520644795825628119823506176672683456544539675613895749357067944465796492899363087465652749951069021248729871498716450122759675266109104893465718371075137027806815473672093804600537277140261127375373193053173163711234309619016940818893190549811778822641165586070952778825226669497115448984409
e = 31406775715899560162787869974700016947595840438708247549520794775013609818293759112173738791912355029131497095419469938722402909767606953171285102663874040755958087885460234337741136082351825063419747360169129165
c = 97724073843199563126299138557100062208119309614175354104566795999878855851589393774478499956448658027850289531621583268783154684298592331328032682316868391120285515076911892737051842116394165423670275422243894220422196193336551382986699759756232962573336291032572968060586136317901595414796229127047082707519

print(long_to_bytes(int(pow(c,d,n))))
#flag{9aecf8d8-6966-4ffa-96b0-2e744d28baf2}
```
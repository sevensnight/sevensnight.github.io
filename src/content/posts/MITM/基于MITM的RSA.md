---
title: 基于MITM的RSA
published: 2025-03-20
pinned: true
description: 基于 MITM 中间相遇攻击的例题的解题思路
tags: [MITM]
category: Article
author: SevensNight
licenseName: "CC BY-NC-SA 4.0"
draft: false
date: 2025-03-20
permalink: "DH-MITM-RSA"
---

# 基于MITM的RSA

## 什么是MITM?

#### 概述

:::WARNING[MITM]
**MITM**(中间相遇攻击)是基于**DH**加密的一种攻击手段,而**DH**(Diffie-Hellman)是一种密钥交换协议,用于双方在不共享密钥的情况下协商出一个共享密钥,简单来说**DH**密钥交换算法的主要目的就是为通信双方生成一个共享的秘密,它是一种基于**离散对数问题**(DLP)的加密算法
:::

#### DH算法加密原理

##### 1.公开的参数

+ 假设A和B都选择同一个模数`9`

+ (在**DH**协议中这个数(相当于`p`)一般是很大的素数)

##### 2.私钥

+ 现在A和B各自随机生成一个秘密数字`ka=3`和`kb=4`,这就相当于**DH**协议中的**私钥**,这些私钥是用户自己生成的,不会被发送或公开

##### 3.公钥(特征值)

+ A和B通过计算`ta=3×9=27`和`tb=4×9=36`得到的值,类似于**DH**协议中的**公钥**

+ (不过其实在标准**DH**加密中**公钥**是用`g^ka mod p`计算,其中`g`是一个生成元(一般为`2`),`ka`是私钥,`p`是模数)

##### 4.交换密钥

+ 现在A把计算得到的`27`给B;B把计算得到的`36`给A

##### 5.计算共享密钥

+ A和B通过对方的**公钥**和自己的**私钥**相乘计算出的最终密钥`kab=108`,相当于**DH**协议中的**共享密钥**

+ (在真正的**DH**协议中,**共享密钥**的计算公式是`(g^kb)^ka mod p`或`(g^ka)^kb mod p`,由于模幂运算的性质,这两种计算方式的结果是相同的)

#### MITM攻击原理

##### 分解问题

+ 假设攻击者知道一对明文和密文`(P,C)`,其中`C=P^e mod n`,攻击者的目标是找到私钥`d`,使得`P=C^d mod n`

##### 中间相遇攻击步骤

+ **第一阶段**:攻击者选择一个中间点`k`,将密钥空间分为两部分,例如,假设密钥长度为`L`,攻击者可以将密钥分为两部分,每部分长度为`L/2`
+ **第二阶段**:攻击者分别计算两部分的中间结果,对于第一部分,计算所有可能的`C^d1 mod n`(其中`d1`是第一部分的可能值),并将结果存储在一个表中,对于第二部分,计算所有可能的`(C^d1)^d2 mod n`(其中`d2`是第二部分的可能值),并检查结果是否与明文`P`匹配
+ **匹配中间结果**:通过查找表中的中间结果,找到匹配的`d1`和`d2`,从而恢复完整的私钥`d=d1×d2`

(该方法还可以推广到**2DES**的解密)

## 题目1

:::CAUTION[题目来源]
GHCTF2025-MITM_RSA
:::
```python
from Crypto.Util.number import *
from hashlib import md5
from secret import KEY, flag  

assert int(KEY).bit_length() == 36
assert not isPrime(KEY)

p = getPrime(1024)
q = getPrime(1024)
n = p * q
e = 0x10001

ck = pow(KEY, e, n)

assert flag == b'NSSCTF{' + md5(str(KEY).encode()).hexdigest().encode() + b'}'

print(f"{n = }")
print(f"{e = }")
print(f"{ck = }")

'''
n = 26563847822899403123579768059987758748518109506340688366937229057385768563897579939399589878779201509595131302887212371556759550226965583832707699167542469352676806103999861576255689028708092007726895892953065618536676788020023461249303717579266840903337614272894749021562443472322941868357046500507962652585875038973455411548683247853955371839865042918531636085668780924020410159272977805762814306445393524647460775620243065858710021030314398928537847762167177417552351157872682037902372485985979513934517709478252552309280270916202653365726591219198063597536812483568301622917160509027075508471349507817295226801011
e = 65537
ck = 8371316287078036479056771367631991220353236851470185127168826270131149168993253524332451231708758763231051593801540258044681874144589595532078353953294719353350061853623495168005196486200144643168051115479293775329183635187974365652867387949378467702492757863040766745765841802577850659614528558282832995416523310220159445712674390202765601817050315773584214422244200409445854102170875265289152628311393710624256106528871400593480435083264403949059237446948467480548680533474642869718029551240453665446328781616706968352290100705279838871524562305806920722372815812982124238074246044446213460443693473663239594932076
'''
```

这次GHCTF(2025)让我受益匪浅收获良多,又学到了

## 解题思路

#### 小明文攻击或者模多式求根?

+ 首先审计代码可知`int(KEY).bit_length() == 36`,`KEY`看起来很小,是否意味着我们可以使用**小明文攻击**或者**模多式求根**呢?
+ 实际上并不可行,`e`很大,计算时间复杂度不可估量

#### 再次审计代码

+ `assert not isPrime(KEY)`有什么深意吗?为什么明文一定是个合数?

	合数一定可以分解为两个素数相乘,所以这里的`KEY`理论上可以爆破出来

+ 题目就叫**MITM**,根据**MITM**的思想就是类似**二分查找(分冶法)**

#### 尝试BSGS

+ 要找到满足条件的`KEY`,可以采用**大步小步算法**(Baby-Step Giant-Step, BSGS)来高效地解决模`n`下的离散根问题

##### 详细实现细节

+ **参数设置**:已知`KEY`的位数为`36`位,即范围在`[0, 2^36)`
+ 设步长`S = 2^18`,将搜索空间分为`S`个块

+ **预计算小步(Baby Steps)**:计算并存储所有`j^e mod n`(j从0到S-1)的值到哈希表,键为结果,值为`j`
+ **处理大步(Giant Steps)**:计算`S^e mod n`,记为`S_e`
+ 对于每个`i`(0到S-1):

	计算当前块基值`(i * S)^e mod n = (i^e * S_e) mod n`
	计算其模逆元`inv = inverse((i * S)^e, n)`
	计算目标值`target = ck * inv mod n`

+ 在预计算的哈希表中查找`target`,若存在`j`,则`KEY = i * S + j`
+ **验证结果**:检查找到的`KEY`是否满足`bit_length`为`36`且为合数

##### 代码实现

```python
from sympy import isprime

def find_key(n, ck, e):
    B = 1 << 36  # KEY的上界（2^36）
    S = 1 << 18  # 步长（2^18）

    # 预计算Baby Steps
    baby_steps = {}
    for j in range(S):
        m = pow(j, e, n)
        baby_steps[m] = j

    # 计算S^e mod n
    S_e = pow(S, e, n)

    # 查找Giant Steps
    for i in range(S):
        giant_step = pow(i, e, n) * S_e % n
        if giant_step == 0:  # 如果giant_step为0，跳过
            continue

        # 遍历baby_steps，直接验证是否存在满足条件的KEY
        for baby_step in baby_steps:
            if (giant_step * baby_step) % n == ck:
                j = baby_steps[baby_step]
                key = i * S + j
                if key.bit_length() == 36 and not isprime(key):  # 验证KEY的位长度和是否为合数
                    return key

    return None

# 给定参数
n = 26563847822899403123579768059987758748518109506340688366937229057385768563897579939399589878779201509595131302887212371556759550226965583832707699167542469352676806103999861576255689028708092007726895892953065618536676788020023461249303717579266840903337614272894749021562443472322941868357046500507962652585875038973455411548683247853955371839865042918531636085668780924020410159272977805762814306445393524647460775620243065858710021030314398928537847762167177417552351157872682037902372485985979513934517709478252552309280270916202653365726591219198063597536812483568301622917160509027075508471349507817295226801011
e = 65537
ck = 8371316287078036479056771367631991220353236851470185127168826270131149168993253524332451231708758763231051593801540258044681874144589595532078353953294719353350061853623495168005196486200144643168051115479293775329183635187974365652867387949378467702492757863040766745765841802577850659614528558282832995416523310220159445712674390202765601817050315773584214422244200409445854102170875265289152628311393710624256106528871400593480435083264403949059237446948467480548680533474642869718029551240453665446328781616706968352290100705279838871524562305806920722372815812982124238074246044446213460443693473663239594932076

# 调用函数
key = find_key(n, ck, e)
if key:
    print(f"找到满足条件的 KEY: {key}")
    print(f"验证: pow(KEY, e, n) == ck -> {pow(key, e, n) == ck}")
else:
    print("未找到满足条件的 KEY")
```

##### 失败了……

为什么没找到呢,当时觉得是算法问题,但是细想后发现问题所在

**BSGS**是把`KEY`分解为`i * S + j`,为什么不直接分解为`i * j`呢?

#### 尝试MITM算法

- 参考算法 [https://github.com/Liblor/rsa-meet-in-the-middle-attack/blob/master/rsa-meet-in-middle-parallelized.c](https://github.com/Liblor/rsa-meet-in-the-middle-attack/blob/master/rsa-meet-in-middle-parallelized.c)

+ 原本是c语言,我给改成Python了

##### 代码实现

```python
import threading
from gmpy2 import mpz, powmod, invert, isqrt
import time

# Constants
NUM_THREADS = 10
L = 48
# 这里我写36跑不出来,改成48就可以了
# 也许提高上限就好跑出来?
E = 65537

# RSA Parameters
N = mpz("26563847822899403123579768059987758748518109506340688366937229057385768563897579939399589878779201509595131302887212371556759550226965583832707699167542469352676806103999861576255689028708092007726895892953065618536676788020023461249303717579266840903337614272894749021562443472322941868357046500507962652585875038973455411548683247853955371839865042918531636085668780924020410159272977805762814306445393524647460775620243065858710021030314398928537847762167177417552351157872682037902372485985979513934517709478252552309280270916202653365726591219198063597536812483568301622917160509027075508471349507817295226801011")
CIPHERTEXT = mpz("0x425047ffee0b5877c23161902577ee5189b4624a56bf86b693af84762de2d0caca55fbd3e49f6317490b396b1b5190918e5bc354466157d54c95d282ec895b9f1c852d6838f3f1f9617f7f825ac10575f2fa78571d19f25dafe31e8d3d78d2c5208492da201af004901e9a4f3c3fa387232e8762c48b82980c892a6e2188e2bbbd381a292392e81d5759fa76d01856119c4a466c40fbc6510d3e8c52f341ac9006562aeaed0889bf75e045ad5cca1b0a9e53e682532551a8cc8cf6390c98c73c12d30f8bcee076d9063da05e7fc466a23a2c5d3c2a8883b349423258d984dd908c6009bb0cc3cde8e371a49cbff7ac1b8082f0ad4cf8c066952977cf27cb776c")

# Precalculation table structure
class Precalc:
    def __init__(self, i, val):
        self.i = i
        self.val = val

# Binary search implementation
def binary_search(arr, x):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid].val < x:
            low = mid + 1
        elif arr[mid].val > x:
            high = mid - 1
        else:
            return mid
    return -1

# Function to build the precalculation table
def build_table(start, end, e, n, table):
    for i in range(start, end):
        val = powmod(i + 1, e, n)
        table[i] = Precalc(i + 1, val)

# Function to perform the meet-in-the-middle attack
def rsa_meet_in_the_middle(start, end, c, arr, e, n, stop, res):
    for i in range(start, end):
        if stop[0]:
            break
        ii = i + 1
        tmp = powmod(ii, e, n)
        tmp = invert(tmp, n)
        s = (c * tmp) % n
        idx = binary_search(arr, s)
        if idx != -1:
            res[0] = ii * arr[idx].i
            stop[0] = True
            break

# Thread worker for building the table
def build_table_thread(args):
    build_table(args["start"], args["end"], args["e"], args["n"], args["table"])

# Thread worker for meet-in-the-middle attack
def mitm_thread(args):
    rsa_meet_in_the_middle(args["start"], args["end"], args["c"], args["arr"], args["e"], args["n"], args["stop"], args["res"])

def main():
    print("[+] Program started")
    e = mpz(E)
    n = mpz(N)
    ciphertext = mpz(CIPHERTEXT)
    m = None

    print("[+] Allocating memory")
    table_size = 1 << (L // 2)
    table = [None] * table_size

    print("[+] Calculating table entries")
    range_size = (table_size + NUM_THREADS - 1) // NUM_THREADS
    threads = []
    for i in range(NUM_THREADS):
        start = i * range_size
        end = min((i + 1) * range_size, table_size)
        args = {
            "start": start,
            "end": end,
            "e": e,
            "n": n,
            "table": table
        }
        thread = threading.Thread(target=build_table_thread, args=(args,))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()

    print("[+] Sorting the table")
    table.sort(key=lambda x: x.val)

    print("[+] Performing meet-in-the-middle lookup")
    stop = [False]
    res = [None]
    threads = []
    for i in range(NUM_THREADS):
        start = i * range_size
        end = min((i + 1) * range_size, table_size)
        args = {
            "start": start,
            "end": end,
            "c": ciphertext,
            "arr": table,
            "e": e,
            "n": n,
            "stop": stop,
            "res": res
        }
        thread = threading.Thread(target=mitm_thread, args=(args,))
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()

    if res[0] is None:
        print("[-] Meet-in-the-middle attack failed")
        return 1

    print("[+] Recovered message:")
    print(res[0])

if __name__ == "__main__":
    main()
```

##### 效率可能不高……

跑了约6分钟,我感觉做复杂了

<img src="/src/content/posts/MITM/1.png" width="55%">

```python
import hashlib

KEY = 62495925932
flag = b'NSSCTF{' + hashlib.md5(str(KEY).encode()).hexdigest().encode() + b'}'
print(flag)
#NSSCTF{14369380f677abec84ed8b6d0e3a0ba9}
```

#### 再悟MITM

+ 构造`KEY = i * j`
+ `ck = KEY ^ e =(i * j) ^ e = i ^ e * j ^ e => i ^ e = j ^ - e * ck`
+ 假设`i`和`j`都在`20`位以内

##### 代码实现

```python
from tqdm import trange
from hashlib import md5

def find_key(n, e, ck):
    #创建一个字典存储i^e % n的结果
    dic = {}
    for i in trange(1, 1 << 20, desc="Calculating baby steps"):
        dic[pow(i, e, n)] = i

    #遍历i,计算c_k * i^{-e} % n
    for i in trange(1, 1 << 20, desc="Calculating giant steps"):
        try:
            v = (ck * pow(i, -e, n)) % n
            if v in dic:
                print(f"Found match: {dic[v]} * {i} = {dic[v] * i}")
                return dic[v] * i
        except ValueError:
            #如果i^{-e}不存在,跳过
            continue

    return None

n = 26563847822899403123579768059987758748518109506340688366937229057385768563897579939399589878779201509595131302887212371556759550226965583832707699167542469352676806103999861576255689028708092007726895892953065618536676788020023461249303717579266840903337614272894749021562443472322941868357046500507962652585875038973455411548683247853955371839865042918531636085668780924020410159272977805762814306445393524647460775620243065858710021030314398928537847762167177417552351157872682037902372485985979513934517709478252552309280270916202653365726591219198063597536812483568301622917160509027075508471349507817295226801011
e = 65537
ck = 8371316287078036479056771367631991220353236851470185127168826270131149168993253524332451231708758763231051593801540258044681874144589595532078353953294719353350061853623495168005196486200144643168051115479293775329183635187974365652867387949378467702492757863040766745765841802577850659614528558282832995416523310220159445712674390202765601817050315773584214422244200409445854102170875265289152628311393710624256106528871400593480435083264403949059237446948467480548680533474642869718029551240453665446328781616706968352290100705279838871524562305806920722372815812982124238074246044446213460443693473663239594932076

key = find_key(n, e, ck)
if key:
    print(f"找到满足条件的 KEY: {key}")
    print(f"验证: pow(KEY, e, n) == ck -> {pow(key, e, n) == ck}")
    flag = f"NSSCTF{{{md5(str(key).encode()).hexdigest()}}}"
    print(f"Flag: {flag}")
else:
    print("未找到满足条件的 KEY")
'''
Calculating baby steps: 100%|██████████| 1048575/1048575 [01:14<00:00, 14148.78it/s]
Calculating giant steps:  10%|▉         | 103003/1048575 [00:15<02:18, 6851.40it/s]
Found match: 606733 * 103004 = 62495925932
找到满足条件的 KEY: 62495925932
验证: pow(KEY, e, n) == ck -> True
Flag: NSSCTF{14369380f677abec84ed8b6d0e3a0ba9}
'''
```

很明显速度快多了O(∩_∩)O

或者用下面这个代码计算

```python
from tqdm import trange

n = 26563847822899403123579768059987758748518109506340688366937229057385768563897579939399589878779201509595131302887212371556759550226965583832707699167542469352676806103999861576255689028708092007726895892953065618536676788020023461249303717579266840903337614272894749021562443472322941868357046500507962652585875038973455411548683247853955371839865042918531636085668780924020410159272977805762814306445393524647460775620243065858710021030314398928537847762167177417552351157872682037902372485985979513934517709478252552309280270916202653365726591219198063597536812483568301622917160509027075508471349507817295226801011
ck = 8371316287078036479056771367631991220353236851470185127168826270131149168993253524332451231708758763231051593801540258044681874144589595532078353953294719353350061853623495168005196486200144643168051115479293775329183635187974365652867387949378467702492757863040766745765841802577850659614528558282832995416523310220159445712674390202765601817050315773584214422244200409445854102170875265289152628311393710624256106528871400593480435083264403949059237446948467480548680533474642869718029551240453665446328781616706968352290100705279838871524562305806920722372815812982124238074246044446213460443693473663239594932076

lookup1 = {}
lookup2 = {}
for a in trange(1, 2**20):
    lookup1[ck * pow(a, -65537, n) % n] = a
for b in trange(1, 2**20):
    lookup2[pow(b, 65537, n)] = b
inter = set(lookup1.keys()).intersection(set(lookup2.keys()))
print(f'{inter = }')
for i in inter:
    a = lookup1[i]
    b = lookup2[i]
    k = a*b
    print(f'recovered {k = }')

'''
100%|██████████| 1048575/1048575 [03:09<00:00, 5531.73it/s]
100%|██████████| 1048575/1048575 [01:12<00:00, 14453.90it/s]
inter = {261403193576813416519416570819742299683381924383805190815772305764685638057653194273196342185063846056392918989987281254506232531273027849176834511373334149979989408385955231870874092751332282943439306321183673382905963821359311819467610832584302078916726398456065461946316363558081927063293470798336576801346940676840056621291083947064462146344215368617234896744527261572708812986996564034999311148710141035853606581457794526171597307586274353687017760977431056822218043173258352396751078282806427949889404051530094672586240782255744053667207955315271028109588558714090132645577240758284734497326024262664038315807, 21348538889162284455664260482635520290874023200493625877817378089266876131988029230818949917697069728789987613272951048808862162705803059111021204986289833398743166351844339907768995688387464931970312496356109755592976947651364561597219385468444827519603575274809048000398522524048800127962350613216922517019785142011254762762967896372216312436555704490115766681552911235330819974882283970648211435522756428891145271201283628278798419874423498066732575838787042976664854756121978785040523973467758369186749436543863242581435588073333018514613767295523127629261232206669167633568921401177078484084931141889579568267303}
recovered k = 62495925932
'''
```



现在我们已经学习到了**MITM**算法的核心思想,那就再来看一道题

## 题目2

:::CAUTION[题目来源]
nullcon CTF-hackim-2019-FUN
:::
```python
24 bit key space is brute forceable so how about 48 bit key space? flag is hackim19{decrypted flag}

16 bit plaintext: b'0467a52afa8f15cfb8f0ea40365a6692' flag: b'04b34e5af4a1f5260f6043b8b9abb4f8'

from hashlib import md5
from binascii import hexlify, unhexlify
from secret import key, flag
BLOCK_LENGTH = 16
KEY_LENGTH = 3
ROUND_COUNT = 16

sbox = [210, 213, 115, 178, 122, 4, 94, 164, 199, 230, 237, 248, 54,
        217, 156, 202, 212, 177, 132, 36, 245, 31, 163, 49, 68, 107,
        91, 251, 134, 242, 59, 46, 37, 124, 185, 25, 41, 184, 221,
        63, 10, 42, 28, 104, 56, 155, 43, 250, 161, 22, 92, 81,
        201, 229, 183, 214, 208, 66, 128, 162, 172, 147, 1, 74, 15,
        151, 227, 247, 114, 47, 53, 203, 170, 228, 226, 239, 44, 119,
        123, 67, 11, 175, 240, 13, 52, 255, 143, 88, 219, 188, 99,
        82, 158, 14, 241, 78, 33, 108, 198, 85, 72, 192, 236, 129,
        131, 220, 96, 71, 98, 75, 127, 3, 120, 243, 109, 23, 48,
        97, 234, 187, 244, 12, 139, 18, 101, 126, 38, 216, 90, 125,
        106, 24, 235, 207, 186, 190, 84, 171, 113, 232, 2, 105, 200,
        70, 137, 152, 165, 19, 166, 154, 112, 142, 180, 167, 57, 153,
        174, 8, 146, 194, 26, 150, 206, 141, 39, 60, 102, 9, 65,
        176, 79, 61, 62, 110, 111, 30, 218, 197, 140, 168, 196, 83,
        223, 144, 55, 58, 157, 173, 133, 191, 145, 27, 103, 40, 246,
        169, 73, 179, 160, 253, 225, 51, 32, 224, 29, 34, 77, 117,
        100, 233, 181, 76, 21, 5, 149, 204, 182, 138, 211, 16, 231,
        0, 238, 254, 252, 6, 195, 89, 69, 136, 87, 209, 118, 222,
        20, 249, 64, 130, 35, 86, 116, 193, 7, 121, 135, 189, 215,
        50, 148, 159, 93, 80, 45, 17, 205, 95]
p = [3, 9, 0, 1, 8, 7, 15, 2, 5, 6, 13, 10, 4, 12, 11, 14]

def xor(a, b):
    return bytearray(map(lambda s: s[0] ^ s[1], zip(a, b)))

def fun(key, pt):
    assert len(pt) == BLOCK_LENGTH
    assert len(key) == KEY_LENGTH
    key = bytearray(unhexlify(md5(key).hexdigest()))
    ct = bytearray(pt)
    for _ in range(ROUND_COUNT):
        ct = xor(ct, key)
        for i in range(BLOCK_LENGTH):
            ct[i] = sbox[ct[i]]
        nct = bytearray(BLOCK_LENGTH)
        for i in range(BLOCK_LENGTH):
            nct[i] = ct[p[i]]
        ct = nct
    return hexlify(ct)

def toofun(key, pt):
    assert len(key) == 2 * KEY_LENGTH
    key1 = key[:KEY_LENGTH]
    key2 = key[KEY_LENGTH:]

    ct1 = unhexlify(fun(key1, pt))
    ct2 = fun(key2, ct1)

    return ct2

print("16 bit plaintext: %s" % toofun(key, b"16 bit plaintext"))
print("flag: %s" % toofun(key, flag))
#16 bit plaintext: b'0467a52afa8f15cfb8f0ea40365a6692'
#flag: b'04b34e5af4a1f5260f6043b8b9abb4f8'
```

## 解题思路

#### 题目要求

+ 我们的目标就是通过给出的明文`16 bit plaintext`和对应的密文`0467a52afa8f15cfb8f0ea40365a6692`算出`key`,从而解密密文`04b34e5af4a1f5260f6043b8b9abb4f8`
+ 根据加密代码和题目描述,很显然方法只有爆破一种,但是爆破6位key的`2**48`种可能是不现实的但正如题目中所说,爆破`2**24`还是非常简单的
+ 所以这时就要用到上面所学的**MITM攻击**的核心思想了

#### 题目分析

+ 审计代码发现加密函数是`fun`,在`toofun`中调用了两次
+ 而且这里并没有将`6`位长的`key`一次性使用,而是将其从中间分开,先用前`3`位加密一次,再用后`3`位加密一次
+ 也就是说实际的加密过程是用两个`3`位的`key`连续加密两次

#### 脚本撰写

```python
from hashlib import md5
from binascii import hexlify, unhexlify

BLOCK_LENGTH = 16
KEY_LENGTH = 3
ROUND_COUNT = 16

sbox = [
    210, 213, 115, 178, 122, 4, 94, 164, 199, 230, 237, 248, 54, 217, 156, 202,
    212, 177, 132, 36, 245, 31, 163, 49, 68, 107, 91, 251, 134, 242, 59, 46,
    37, 124, 185, 25, 41, 184, 221, 63, 10, 42, 28, 104, 56, 155, 43, 250,
    161, 22, 92, 81, 201, 229, 183, 214, 208, 66, 128, 162, 172, 147, 1, 74,
    15, 151, 227, 247, 114, 47, 53, 203, 170, 228, 226, 239, 44, 119, 123, 67,
    11, 175, 240, 13, 52, 255, 143, 88, 219, 188, 99, 82, 158, 14, 241, 78,
    33, 108, 198, 85, 72, 192, 236, 129, 131, 220, 96, 71, 98, 75, 127, 3,
    120, 243, 109, 23, 48, 97, 234, 187, 244, 12, 139, 18, 101, 126, 38, 216,
    90, 125, 106, 24, 235, 207, 186, 190, 84, 171, 113, 232, 2, 105, 200, 70,
    137, 152, 165, 19, 166, 154, 112, 142, 180, 167, 57, 153, 174, 8, 146, 194,
    26, 150, 206, 141, 39, 60, 102, 9, 65, 176, 79, 61, 62, 110, 111, 30,
    218, 197, 140, 168, 196, 83, 223, 144, 55, 58, 157, 173, 133, 191, 145, 27,
    103, 40, 246, 169, 73, 179, 160, 253, 225, 51, 32, 224, 29, 34, 77, 117,
    100, 233, 181, 76, 21, 5, 149, 204, 182, 138, 211, 16, 231, 0, 238, 254,
    252, 6, 195, 89, 69, 136, 87, 209, 118, 222, 20, 249, 64, 130, 35, 86,
    116, 193, 7, 121, 135, 189, 215, 50, 148, 159, 93, 80, 45, 17, 205, 95
]
p = [3, 9, 0, 1, 8, 7, 15, 2, 5, 6, 13, 10, 4, 12, 11, 14]

invsbox = [0] * len(sbox)
for idx, val in enumerate(sbox):
    invsbox[val] = idx

invp = [0] * len(p)
for idx, val in enumerate(p):
    invp[val] = idx

def xor(a, b):
    return bytearray([x ^ y for x, y in zip(a, b)])

def unfun(key, ct):
    assert len(ct) == BLOCK_LENGTH
    assert len(key) == KEY_LENGTH
    key = bytearray(unhexlify(md5(key).hexdigest()))
    pt = bytearray(ct)
    for _ in range(ROUND_COUNT):
        nct = bytearray(BLOCK_LENGTH)
        for i in range(BLOCK_LENGTH):
            nct[i] = pt[invp[i]]
        pt = nct
        for i in range(BLOCK_LENGTH):
            pt[i] = invsbox[pt[i]]
        pt = xor(pt, key)
    return hexlify(pt)

def fun(key, pt):
    assert len(pt) == BLOCK_LENGTH
    assert len(key) == KEY_LENGTH
    key = bytearray(unhexlify(md5(key).hexdigest()))
    ct = bytearray(pt)
    for _ in range(ROUND_COUNT):
        ct = xor(ct, key)
        for i in range(BLOCK_LENGTH):
            ct[i] = sbox[ct[i]]
        nct = bytearray(BLOCK_LENGTH)
        for i in range(BLOCK_LENGTH):
            nct[i] = ct[p[i]]
        ct = nct
    return hexlify(ct)

def toofun(key, pt):
    assert len(key) == 2 * KEY_LENGTH
    key1 = key[:KEY_LENGTH]
    key2 = key[KEY_LENGTH:]

    ct1 = unhexlify(fun(key1, pt))
    ct2 = fun(key2, ct1)

    return ct2

givenct = toofun(b'ABCDEF', b'A' * BLOCK_LENGTH)
flagct = toofun(b'ABCDEF', b'B' * BLOCK_LENGTH)

enctable = {}
for i in range(256 * 256 * 256):
    enctable[fun(unhexlify(format(i, '06x')), b'A' * BLOCK_LENGTH)] = i

print("enctable done")

dectable = {}
for i in range(256 * 256 * 256):
    dectable[unfun(unhexlify(format(i, '06x')), unhexlify(givenct))] = i

print("dectable done")

key = b''
for i in enctable:
    if i in dectable:
        print(enctable[i], dectable[i])
        key = unhexlify(format(enctable[i], '06x')) + unhexlify(format(dectable[i], '06x'))

print(unhexlify(unfun(key[:3], unhexlify(unfun(key[3:], unhexlify(flagct))))).decode('utf-8'))
'''
key = b'\xa2w\xb5\xc1\xbc\x8b'
flag = b'1337_1n_m1ddl38f'
'''
#hackim19{1337_1n_m1ddl38f}
```

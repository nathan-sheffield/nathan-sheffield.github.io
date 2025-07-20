---
title:  "A Nearly Quadratic Improvement for Memory Reallocation"
link: "/assets/papers/allocation.pdf"
linktext: "Link to the paper"
order: 2
conference: "SPAA 24"
authors: "with Martin Farach-Colton, Bill Kuszmaul, and Alek Westover"
notes: "I think it's a neat problem, and probably believe it should be possible to beat this algorithm (maybe even getting polylog(1/ε)-competitive), so you should think about it. Especially if you're really good at subset sums or something."
slides: "/assets/things/allocation-slides.pdf"
fable: "Captain Rem encouraged people to look on the bright side — shouldn't one be grateful to be so saturated with gold? — but there was still grumbling. The problem was, while the loot their seaward plundering accrued was substantial, the long skinny cargo hold they used to stow said loot was somewhat less so. \\

Before the hold was completely full, they always made sure to stop at a port and offload — but even when there was technically enough room, it often took a fair amount of heaving around heavy chests before the crew could find a spot for even a relatively small artifact. If only there was a smarter way to arrange things..."
---

In the Memory (Re)allocation Problem 
a set of items of various sizes must be dynamically assigned to non-overlapping contiguous chunks of memory. 
It is guaranteed that the sum of the sizes of all items present at any time is at most a $(1-\varepsilon)$-fraction of the total size of memory (i.e., the load-factor is at most $1-\varepsilon$).
The allocator receives insert and delete requests online, and can re-arrange existing items to handle the requests.
The allocator aims to minimize the amortized overhead cost of moving items, i.e., the ratio of the total size of items moved to the size of the inserted/deleted item.

The folklore algorithm for Memory (Re)allocation achieves an overhead cost of $ O (\varepsilon^{-1})$ per update. 
In recent work Kuszmaul showed that if the items are all smaller than an $\varepsilon^4$-fraction of memory then it is possible to achieve amortized update cost $ O (\log\varepsilon^{-1})$.
However, Kuszmaul conjectured that for large items the folklore algorithm is optimal. 

In this work we disprove Kuszmaul's conjecture.
In particular, we give an allocator that achieves amortized update cost $\widetilde{O}(\varepsilon^{-1/2})$, regardless of item sizes. A key idea that we use to beat the folklore algorithm is to have nested levels of "representative" items stored as a suffix of memory, where items in smaller levels are "responsible" for items in the larger levels.

Our second result is the first non-trivial lower bound for the Memory (Re)allocation Problem: we demonstrate a sequence of item inserts and deletes on which any allocator must incur amortized update cost at least $\Omega(\log\varepsilon^{-1})$. 
Finally, we analyze the Memory (Re)allocation Problem on a stochastic sequence of inserts and deletes. In this setting we construct an allocator with $ O (\log\varepsilon^{-1})$ expected amortized update cost.

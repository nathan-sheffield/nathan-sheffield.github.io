---
layout: post
title:  "Pi in the Sky"
date:   2025-12-13 4:00:00 -0400
categories: jekyll update
excerpt: "A catalytic APSP algorithm with an exceedingly goofy runtime."
---

Here's a classic algorithms question: if I give you a weighted graph, how fast can you compute the distances between every pair of vertices? This is known as the "all-pairs shortest paths" (APSP) problem. Clearly, if the graph has $n$ vertices, this should take at least $n^2$ time, because you have to output $n^2$ values. But the naive approach would be to e.g. use Dijkstra's algorithm out of every vertex, which would take about $n^2$ time *per vertex*, or $n^3$ time overall[^1]. Despite a lot of work, nobody has been able to come up with anything much better than that, leading to the following conjecture:

> **APSP Hypothesis**: There is no $n^{3-\varepsilon}$-time algorithm for APSP, for any $\varepsilon>0$.

Disproving this conjecture would imply not just better algorithms for APSP, but also for a whole host of other problems that have been shown to be "fine-grained equivalent" to APSP. Let me just cut to the chase here in case you're getting excited and say: no, this post is not about to disprove the APSP hypothesis. I'm about to tell you something way, way sillier.

See, if you're limited not just by time but by *memory*, the situation seems much more dire. For instance, if you only have like $\log(n)$ bits of space to work with[^2], people don't know how to solve the problem *at all*. But we have known for a while that APSP *is* solvable in the "catalytic" logspace model, where you also get a bunch of "junk" memory that must be reset at the end. (See [my last post](https://nathan-sheffield.github.io/jekyll/update/2023/09/25/the-best-algorithm-ever.html "link to my last post") for an introduction to this model[^3].) So you could ask the question: given that I can at least in principle solve this problem in small space, can I solve it in small space and *still get a good runtime*? 

The existing path for showing CL in APSP would absolutely *not* give you a good runtime --- the exact runtime would depend on the details of how you wrote the argument, but you'd certainly end up with something closer to $n^{30}$ than $n^3$. So I decided at some point to sit down and try to come up with a bespoke $\mathsf{CL}$ algorithm for APSP that was as runtime-optimized as I could manage to make it. I got stuck well before making it down to $n^3$ though, which leads me to introduce the following complexity theoretic conjecture:

> **Catalytic APSP Hypothesis**: There is no $n^{\log_2(20) + \pi^2/6 - \varepsilon}$-time $\mathsf{CL}$ algorithm for APSP, for any $\varepsilon>0$. (Where $\log_2(20) + \pi^2/6 \approx 5.97$.)

Ok, obviously I'm messing with you here. This would be a ridiculous thing to conjecture --- why on earth would $\log_2(20) + \pi^2/6$ be a fundamental barrier?? That's literally the weirdest exponent I've ever seen in a runtime. And yet, I did put some elbow grease into this, and was able to get a runtime that small but no smaller. So this number is at least coming from *somewhere*. 

If you want to see the argument, [here's a sketch of the algorithm](/assets/things/catalytic-apsp-sketch.pdf "pdf explaining the APSP algorithm"). But the main question I'm interested in asking here is "should you care about this?"[^4]. I think from any sort of practical perspective the answer should be "no" --- $n^{5.97}$ is better than $n^{30}$, but for sure neither are so good that you'd ever consider using them, even if the assumption that you have lots of "catalytic junk memory" was somehow realistic. What about from a theory perspective? Well, even then it's not clear --- even if you decide you do really care about time-space tradeoffs for APSP, it's still not like I have any actual evidence that $n^{5.97}$ is the *right* answer, any more than $n^{30}$ was. This may come as a great shock, but the fact that Nathan doesn't know how to do something does not always mean that said thing is fundamentally ruled out by the laws of physics. And I don't expect many (if any) other people to seriously try to improve this[^5].

But the truth is that, at least on some level, I *do* care about this. Because, even if it's not the right answer, I'm just pleased that my honest-to-goodness best effort to solve this particular algorithmic problem ended up with the number $\pi$ in the exponent[^6]. Thanks, universe! Stay weird.

<hr class = "header-line">


[^1]: Well, if we assume the edge weights are all numbers between $0$ and $2^{o(n)}$, and we ignore $n^{o(1)}$ terms in the runtime. Of course, if the edge weights are so enormous that it takes us a substantial amount of time just to _write them down_, then that's going to blow up the time. So probably you should assume all edge weights are bounded by some polynomial in $n$.

[^2]: Since the output is way larger than $\log(n)$ bits, here we'd be hoping e.g. to write the output to some *write-only* memory not counted in those $\log(n)$ bits. In the catalytic version, we could instead hope to add the output on top of some portion of the junk space.

[^3]: The fact that APSP is solvable in CL comes from the $\mathsf{TC}^1$ circuit evaluation algorithm described in that post, since APSP is known to be solvable by $\mathsf{TC}^1$ circuits.

[^4]: Here, let's say we're assuming you care about theory/catalytic computing generally, although it's already far from obvious that you should care about those things.

[^5]: Although if you, the reader, want to prove me wrong, I would be delighted! If you can get me an $n^{5.96}$ algorithm I hereby promise to bake you cookies :)

[^6]: Coming from the classic fact that $1^{-2} + 2^{-2} + 3^{-2} + \dots = \frac{\pi^2}{6}$, which is itself a well-established Bizzare Math Thing, but also this is still a pretty bizzare thing to see in your runtime exponent.
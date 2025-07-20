---
title:  "Matching Algorithms in the Sparse Stochastic Block Model"
link: "/assets/papers/sbm-matching-conference.pdf"
linktext: "Link to the paper"
order: 1
authors: "with Anna Brandenburger, Byron Chin, and Divya Shyamal"
conference: "AofA 24"
slides: "/assets/things/sbm-matching-slides.pdf"
notes: "This project was done at SPUR (a summer program at MIT). The techniques are very standard, but it was a fun first TCS project."
fable: "When he'd set out to recruit an adventuring party, Theo had been imagining a process a little more snappy and Gandalf-esque, not these hours upon hours of interviews. However, it had quickly become apparent that the coarse-grained information in the 'Heroism and Questing' personal ads just wouldn't be enough to pick people.\\

Take this fellow, for instance. Theo could've predicted, based on the '23 M, half-orc, barbarian, passionate about skull-cracking and menacing' description, that he'd likely be a better fit for one of the more… hands-on parts of the team. But it was a total roll of the dice whether he'd end up being a qualified Chief Dragon Slayer — a roll which, upon receiving the response 'deathly afraid of serpents, Mr. Rem' to the question of 'what's your biggest weakness', Theo was disappointed to learn had come up snake-eyes. 'You seem like you'd make a great Junior Axe-Wielding Goon,' Theo acceded, 'but unfortunately we filled that position last week. I don't think we'll be able to make you an offer at this point in time.'\\

Theo glanced resignedly at his list of unfilled positions: 14 openings for fighters, 9 for negotiations/logistics, 6 for skullduggery and subterfuge, and 7 for magic experts. How many interviews would it take to fill them all? With the sort of decisions he'd been making thus far, it seemed likely to be quite a few — early in the process, he made the mistake of hiring a competent sorcerer as a dungeon cartographer, not realizing quite how few-and-far-between magic users were, and now no amount of cajoling could convince her to give up her maps. He had to figure out how to avoid making that kind of blunder again…"
---

The **stochastic block model** (SBM) is a generalization of the Erdos-Renyi model of random graphs that describes the interaction of a finite number of distinct communities. In sparse Erdos-Renyi graphs, it is known that a linear-time algorithm of Karp and Sipser achieves near-optimal matching sizes almost surely asymptotically almost surely, giving a law-of-large numbers for the matching sizes of such graphs in terms of solutions to an ODE. We provide an extension of this analysis, identifying broader ranges of stochastic block model parameters for which the Karp--Sipser algorithm achieves near-optimal matching sizes, but demonstrating that it cannot perform optimally on general SBM instances.

We also consider the problem of constructing a matching *online*, in which the vertices of one half of a bipartite stochastic block model arrive one-at-a-time, and must be matched as they arrive. We show that the competitive ratio lower bound of 0.837 found by Mastin and Jaillet for the Erdos-Renyi case is tight, and that it can be achieved in the stochastic block model whenever the expected degrees in all communities are equal. We propose several reasonable linear-time algorithms for online matching in the general stochastic block model, but prove that despite very good experimental performance, none of these achieve online asymptotic optimality.
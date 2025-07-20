---
title:  "Complexity of Multiple-Hamiltonicity in Graphs of Bounded Degree"
link: "/assets/papers/ham.pdf"
linktext: "Link to the paper"
order: 3
authors: "with Brian Liu and Alek Westover" 
conference: "preprint"
notes: "This one came out of a problem suggested in Erik Demaine's ''Fun with Hardness'' class. I actually initially thought we weren't going to get tight answers, but then as I wrote it up figured out how to close the gaps --- this is notable as my only experience thus far having something end up _more_ clean than expected when I wrote it down :)"
fable: "'Out of sight, out of mind', goes the old adage. Or maybe it's 'familiarity breeds contempt'? Never has Theo Rem been so aware of the fine line between these maxims as now, leading the king's diplomatic party through the burrows of the pig-gnomes.\\

In order to set up any kind of lasting relations with a particular gnome clan, one has to pay at least three visits to their village, somewhere in the depths of this twisted network of tunnels. However, the milk of porcine kindness is easily strained should one overstay one's welcome: trying to travel through the same village more than five times is a sure way to sow ill-feelings. Far from bringing home the bacon, an unwelcome guest is lucky to bring home their own head.\\

Looking at the branching (but not too branching) map of tunnels boared between villages, Theo begins to wallow in despair: even if the route he seeks does exist, is it possible to find it?"
---

We study the following generalization of the Hamiltonian cycle problem:
Given integers $a,b$ and graph $G$, does there exist a closed walk in $G$ that visits every vertex at least $a$ times and at most $b$ times? Equivalently, does there exist a connected $[2a,2b]$ factor of $2b \cdot G$ with all degrees even? This problem is $\mathsf{NP}$-hard for any constants $1 \leq a \leq b$. However, the graphs produced by known reductions have maximum degree growing linearly in $b$. The case $a = b = 1 $ --- i.e. Hamiltonicity --- remains $\mathsf{NP}$-hard even in $3$-regular graphs; a natural question is whether this is true for other $a$, $b$. 

In this work, we determine which $a, b$ permit polynomial time algorithms and which lead to $\mathsf{NP}$-hardness in graphs with constrained degrees. We give tight characterizations for regular graphs and graphs of bounded max-degree, both directed and undirected.

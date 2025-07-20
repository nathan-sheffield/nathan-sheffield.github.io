---
title:  "Catalytic Communication"
link: "/assets/papers/catalytic-communication.pdf"
linktext: "Draft of the paper"
authors: "with Ted Pyne and William Wang"
conference: "ITCS 25"
order: 6
talk: "https://youtu.be/yfuVtEIBYn0"
fable: "Theo is locked in the depths of the royal dungeons, on suspicion of intentionally sabotaging the king's dinner party. The guards have been trying to determine whether he and his second-in-command, Cora Larry, have a consistent alibi. \\

Which they do. At least, Theo thinks they do: they'd agreed on a detailed lie long in advance. However, as a bizarre interrogation technique, a witch has placed a hex of forgetfulness on both suspects, preventing them from forming more than a couple bits worth of new long-term memories. Now, Theo's concerned the hex may have scrambled some existing memories as a side-effect, possibly making the two stories inconsistent. What he'd love to do is leave some message for Cora in the interrogation room, listing his whole story and asking her to confirm it matches hers --- but there doesn't seem to be anywhere to hide such a message. \\

Anywhere, that is, except the Head of the Guard's chessboard. He left a game partway in progress, and the rank-and-file guards won't notice if it's tampered with. The issue, of course, is that when the Head of the Guard returns, if the board isn't exactly as he left it, he'll know it was used to pass information. \\

Fortunately, the two conspirators have a plan. When the guards aren't looking, Cora carefuly shuffles the pieces on the board, making sure to preserve all the information of the original position so that she can reset it in her next session. When Theo is brought in, he looks at the board, and commits to memory a small but crucial fact about the position. At his next interrogation, he glances at the pieces, now returned to their original state, and breaks into a confident smirk. \\

'I'm ready to talk.'"

notes: "I think this is my favourite paper on this list at the moment. 
When first defining this model, I just thought it was kinda a cute story, but thinking more about it felt like it gave more intuition about catalytic space than I was expecting. Also, I was just really delighted to find applications of fun graph theory tools where I wasn't expecting them."
---

The study of space-bounded computation has drawn extensively from ideas and results in the field of communication complexity. Catalytic Computation (Buhrman, Cleve, Koucky, Loff and Speelman, STOC 2013) studies the power of bounded space augmented with a pre-filled hard drive that can be used non-destructively during the computation. Presently, many structural questions in this model remain open. Towards a better understanding of catalytic space, we define a model of *catalytic communication complexity* and prove new upper and lower bounds.
    
In our model, Alice and Bob share a blackboard with a tiny number of free bits, and a larger section with an arbitrary initial configuration. They must jointly compute a function of their inputs, communicating only via the blackboard, and must always reset the blackboard to its initial configuration. We prove several upper and lower bounds:

i) We characterize the simplest nontrivial model, that of one bit of free space and three rounds, in terms of $\mathbb{F}_2$ rank. In particular, we give natural problems that are solvable with a minimal-sized blackboard that require near-maximal (randomized) communication complexity, and vice versa.

ii) We show that allowing constantly many free bits, as opposed to one, allows an exponential improvement on the size of the blackboard for natural problems. To do so, we connect the problem to existence questions in extremal graph theory. 

iii) We give tight connections between our model and standard notions of non-uniform catalytic computation. Using this connection, we show that with an arbitrary constant number of rounds and bits of free space, one can compute all functions in $\mathsf{TC}^0$.

We view this model as a step toward understanding the value of filled space in computation.

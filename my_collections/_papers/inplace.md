---
title:  "The Structure of In-Place Space-Bounded Computation"
link: "/assets/papers/inplace.pdf"
linktext: "Link to the paper"
order: 9
conference: "preprint"
authors: "with James Cook, Surendra Ghentiyala, Ian Mertz, and Ted Pyne"
notes: "Ooh I could tell you lots of stories about the history of these results (like finding an awkward bug in the oracle construction after posting to ECCC and needing to fix oops). But maybe the note I'll leave here is just the question: can we do in-place matrix-vector multiplication without catalytic space? Seems totally plausible that there might be a way to do this. e.g. maybe you could imagine somehow using parts of the input as catalytic space? Or doing something totally different from our current approach. idk I think it's a good problem."
fable: "
Now that the dance contest is actually happening, Theo's role as head judge is supposed to be super easy.
He doesn't even have to do any actual judging --- his two subordinate judges each decide on scores for a contestant, and all Theo has to do is multiply them together and reveal that as the final result.
But he wasn't prepared for the level of precision his two sub-judges would offer: 
\"I think this performance was barely deserving of a 1.2151225152118519213811451849311420251295225251521185185149147208919\" the first whispered to him. And then, moments later \"In my opinion, this was a solid 9.72151919221201511691452051212141208114208519531852023151849191147512615154\".
Jotting these numbers down on his scorecard, Theo realizes with alarm that he's almost completely filled all the available space.
But he's going to have to hold this card up to reveal the result!
He can erase these numbers and write their product instead --- except that he didn't think to bring any scratch paper, so he doesn't have anywhere else to record them while he works out the multiplication.
Is there any fancy way to calculate that lets him erase parts of the numbers as he goes and free up space for their product?
"
---

In the standard model of computing multi-output functions in logspace ($\mathsf{FL}$), we are given a read-only tape holding $x$ and a logarithmic length worktape, and must print $f(x)$ to a dedicated write-only tape. However, there has been extensive work (both in theory and in practice) on in-place algorithms for natural problems, where one must transform $x$ into $f(x)$ in-place on a single read-write tape with only $O(\log n)$ additional workspace. We say $f\in \mathsf{inplaceFL}$ if $f$ can be computed in this model.

We initiate the study of in-place computation from a structural complexity perspective, proving upper and lower bounds on the power of $\mathsf{inplaceFL}$. We show the following:

i) Unconditionally, $\mathsf{FL}\not\subseteq \mathsf{inplaceFL}$. 

ii) For a permutation $f$, if $f\in \mathsf{inplaceFL}$ then $f^{-1} \in\mathsf{avgP}$. Thus, the problems of integer multiplication and evaluating $\mathsf{NC}^0_4$ circuits lie outside $\mathsf{inplaceFL}$ under cryptographic assumptions. 

iii) Despite this, evaluating $\mathsf{NC}^0_2$ circuits can be done in $\mathsf{inplaceFL}$.

iv) We have $\mathsf{FL} \subseteq \mathsf{inplaceFL}^{\mathsf{STP}}.$ Consequently, proving $\mathsf{inplaceFL} \not\subseteq \mathsf{FL}$ would imply $\mathsf{SAT} \not\in \mathsf{L}$.

We likewise show several extensions and strengthenings of the above results to in-place catalytic computation ($\mathsf{inplaceFCL}$), where the in-place algorithm has a large additional worktape tape that it must reset at the end of the computation:

i) Assuming $\mathsf{CL} \neq \mathsf{PSPACE}$, then $\mathsf{FCL} \not\subseteq \mathsf{inplaceFCL}$, and under cryptographic assumptions, integer multiplication and $\mathsf{NC}_4^0$ evaluation lie outside $\mathsf{inplaceFCL}$.

ii) Despite this, $\mathsf{inplaceFCL}$ can provably compute matrix multiplication and inversion over polynomial-sized finite fields.

We use our results and techniques to show two novel barriers to proving $\mathsf{CL} \subseteq \mathsf{P}$. First, we show that any proof of $\mathsf{CL}\subseteq \mathsf{P}$ must be non-relativizing, by giving an oracle $O$ relative to which $\mathsf{CL}^O=\mathsf{EXP}^O$. This answers an open problem raised in the survey of (Mertz B. EATCS). Second, we show that a search problem not known to be in $\mathsf{P}$, namely $\mathcal{C}$-LossyCode for circuits of small width and depth, is in $\mathsf{searchCL}$.

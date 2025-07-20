---
title:  "When to Give Up on a Parallel Implementation"
link: "/assets/papers/scheduling.pdf"
linktext: "Link to the paper"
order: 4
authors: "with Alek Westover"
conference: "ITCS 25"
talk: "https://youtu.be/a0HuR_-aT2s"
notes: "I have no idea if these results are interesting to anyone else, but Alek and I had been trying to figure out the optimal competitive ratios here for like 2 years, so it was really exciting to finally beat 2 (even if we still didn't _quite_ make it all the way to ϕ). Incidentally, this problem is the reason the site logo is golden ratio."
fable: "'Many hands make light work', goes the old adage. Or maybe it's 'too many cooks spoil the broth'? While Theo Rem has been unusually aware of the fine line between maxims of late, now is probably his maxim minding maximum for this particular pair. The reason: he and his adventuring party have been running boring errands for the king all week, and now, as if they didn't already have enough work, he's recieved a royal decree asking them to deep clean the throne chamber. \\

It's a difficult position to be in. He could assign one of his crew to do the job on their own --- but then it would take quite a while. Alternatively, he could ask multiple people to do it, in which case they'd probably step on each other's toes a little bit and be overall less efficient, but at least they'd get it done quickly. \\

He'd better decide correctly though, because his crew is already pretty unhappy --- if they discover they'd been stuck there for much longer than necessary just because of Theo's bad decisions, there might be mutiny. Given that he has no clue what, if anything, the capricious monarch will demand of him next, what should Theo do?"
---
In the Serial Parallel Decision Problem (SPDP), introduced by Kuszmaul and Westover
[SPAA'24], an algorithm receives a series of tasks online, and must choose for each between a serial implementation and a parallelizable (but less efficient) implementation.
Kuszmaul and Westover describe three decision models: 
(1) ***Instantly-committing*** schedulers must decide on arrival, irrevocably, which
implementation of the task to run.
(2) ***Eventually-committing*** schedulers can delay their decision beyond a
task's arrival time, but cannot revoke their decision once made. 
(3) ***Never-committing*** schedulers are always free to abandon their progress on the task and
start over using a different implementation. Kuszmaul and Westover gave a simple instantly-committing scheduler whose total completion time is $3$-competitive with the offline optimal schedule, and proved two lower bounds: no eventually-committing scheduler can have competitive ratio better than $\phi
\approx 1.618$ in general, and no instantly-committing scheduler can have
competitive ratio better than $2$ in general. They conjectured that the three decision models should admit different competitive ratios, but left upper bounds below $3$ in any model as an open problem.

In this paper, we show that the powers of instantly, eventually, and never
committing schedulers are distinct, at least in the ``massively parallel
regime''. The massively parallel regime of the SPDP is the special case
where the number of available processors is asymptotically larger than the
number of tasks to process, meaning that the *work* associated with running
a task in serial is negligible compared to its *runtime*.
In this regime, we show 
(1) The optimal competitive ratio for instantly-committing schedulers is $2$, 
(2) The optimal competitive ratio for eventually-committing schedulers lies in
$[1.618, 1.678]$, 
(3) The optimal competitive ratio for never-committing schedulers lies in $[1.366, 1.500]$. 
We additionally show that our instantly-committing scheduler is also $2$-competitive
outside of the massively parallel regime, giving proof-of-concept that results in the massively parallel regime can be translated to hold with fewer processors. 
---
layout: post
title:  "O Tennenbaum"
date:   2023-12-25 23:18:17 -0400
categories: jekyll update
excerpt: "Nonstandard models of Peano Arithmetic and the true meaning of Christmas"
---

It's Christmas Eve. As usual, you're up late reading a computability theory textbook on your laptop. As the clock ticks forward to midnight, you find your mind wandering from [Soare's rather dense prose](https://link.springer.com/book/10.1007/978-3-642-31933-4 "Soare's computability textbook") to the holiday that's just arrived. As [Randall Munroe points out](https://xkcd.com/1932/ "xkcd comic joking about the true meaning of Christmas"), there's an element of self-reference inherent in the quest to discover the true meaning of Christmas. You laugh to yourself in smug superiority -- what trope could be more trite, vacuous, and overused than the idea of the "true meaning of Christmas"? Satisfied that you're above such kitsch, you continue chuckling to yourself as you begin to nod off in your chair. You throw in a couple "bah humbug"s for good measure.

## The Ghost of Christmas's Logical Foundations

Suddenly, the room around you fades, and a strange ghastly figure appears before your eyes. He has a long beard that seems to twist around and loop back on itself, so that you can't tell where it begins. There are chains draped around his shoulders, and as he rattles them you can tell that each chain has an upper bound. Despite his intimidating appearance, and the suddenness of his arrival, he speaks to you softly, with almost a hint of remorse.

<center>
<figure>
    <img src="/assets/tennenbaum/ghost_of_logical_foundations.png"
         alt="The Ghost of Christmas's Logical Foundations"
         width ="70%">
</figure>
</center>

> "I am the Ghost of Christmas's Logical Foundations. I come to show you the error of your ways, so you can live your life less naively."

Before you have a chance to respond, he disappears again, and you find yourself sitting back in the lecture for logic class last semester. The professor is explaining **first-order logic** -- the basic language, consisting of AND, OR, NOT, EXISTS, and FOR ALL, that can describe the foundations of pretty much all math[^1]. First-order logic has the wonderful property of **completeness**:

> **Completeness Theorem for First-Order Logic**: Given any (possibly infinite) set of axioms, any statement semantically entailed by the axioms can be proved from them.

That is, suppose some statement $\varphi$ is true in any mathematical structure satisfying the axioms. (We call such a structure a "model" for the axioms -- for instance, if the axioms are associativity and existence of an identity and inverses, any specific group is a model for the axioms.) Then, there is a finite list of deductions we can make that represents a formal proof of $\varphi$ assuming the axioms. For example, if something is true for every group, there exists a proof of it from the group axioms. 

The fact that there's this equivalence between something being _semantically_ implied by the axioms (in that the axioms ensure that it's necessarily true) and being _syntactically_ implied by the axioms (in that there exists a proof from the axioms using some formal proof system) is not too hard to show, but it's a non-trivial observation. In particular, it's not true from some more powerful forms of logic -- see the footnotes for some discussion. One interesting consequence is the property of **compactness**:

> **Compactness Theorem for First-Order Logic**: If every finite subset of an infinite set of axioms is consistent (i.e. not self-contradictory), then all of them together are consistent.

Why does this follow from completeness? Well, suppose the whole set of axioms is inconsistent. No model can satisfy them, so (vacuously) the statement FALSE is true in every model satisfying them -- thus by completeness there must exist a finite-length proof of the statement FALSE from the axioms. But a finite-length proof only has room to mention a finite number of the axioms -- if your proof is 1000 characters long, there's no way it can be making reference to 9000 different axioms[^2]. So, just taking those finitely many axioms on their own must already have been inconsistent.

You wonder to yourself why the ghost is showing you this. But now the scene has changed, and the professor is talking about [**Peano arithmetic**](https://en.wikipedia.org/wiki/Peano_axioms "wikipedia page"): the basic axioms defining the natural numbers. Here's a standard axiomatization of Peano arithmetic (where our language has symbols $0$, $S$, $+$ and $\cdot$):

- $\forall x, 0 \neq S x$ 
- $\forall x \forall y, (S x = S y) \iff (x = y)$
- $\forall x, x + 0 = x$
- $\forall x \forall y, x + S y = S(x + y)$
- $\forall x, x \cdot 0 = 0$
- $\forall x \forall y, x \cdot  S y = x \cdot y + y$
- $(\varphi(0) \text{ and } (\forall n \varphi(n) \to \varphi(S n))) \to (\forall n \varphi(n))$

The first of 6 of these are defining $S$ (a "successor" function; i.e. adding 1), then defining $+$ in terms of $S$, and then defining $\cdot$ in terms of $+$, in the ways you would expect. The last of these is the **induction axiom** -- really, it represents a countable infinite number of axioms, one for each formula $\varphi$. It says that, if 0 has a property $\varphi$, and the property is preserved by taking successors, then all numbers have that property. This short list of axioms are used to characterize the structure of the natural numbers -- if you want to start formally proving all your favourite number theory results from the ground up, this is the place to start. 

You shiver involuntarily as you realize what's about to happen. And indeed, as soon as the professor has finished writing down the Peano axioms, the vision has disappeared, and you're left staring face-to-face with something you'd known existed but never seen in the flesh: a non-standard model.

Let me explain. See, these Peano axioms are satisfied by what we usually think of as the natural numbers, $\mathbb{N}$. And they're kinda _supposed_ to be "nailing down" the structure of the natural numbers, in that we hope there's not other different-looking structures that also satisfy them. But, in fact, there are such other structures. We can get this from the compactness theorem. Imagine we take all the Peano axioms, but then we also add on top of them a new symbol $c$, and for every natural number $n$, the axiom $c > n$. So we have all our usual axioms, and also axioms saying $c>0$, $c>1$, $c>2$, $\dots$ [^3]. If you give me any finite subset of these new axioms, they're satisfied by the usual natural numbers: the regular Peano axioms are satisfied, and we just let $c$ correspond to a natural number larger than all the ones mentioned in our set of chosen axioms (e.g. if the largest condition in the set is saying $c>100000$, we take $c=100001$). So, by compactness, all of them at once must be satisfiable. But when you take all of them at once, it's clear that they're no longer satisfied by $\mathbb{N}$ -- there has to be some value $c$ that's larger than every usual natural number (i.e. finite successor of 0)! 

So you were aware that, logically speaking, there _had_ to exist models of Peano Arithmetic looking totally different from $\mathbb{N}$. It's not just some shortcoming of the way we chose the axioms -- the same exact argument would work for _any_ first-order axiomatization of the naturals, even if your axioms consisted of **every first-order sentence true for the usual natural numbers**[^4]. But it's still shocking to see, with your own eyes, a Platonic realization of one of these non-standard models. You look in awe as by your head, alongside old friends like 7 and 1,618,033, float a myriad of different flavours of "$\infty$" larger than all of them, with their own arithmetic structure. Can it really be true that all the theorems number theorists thought they were proving about $\mathbb{N}$ still hold in this alien world?

You awake back in your chair again, mind racing. You wonder if you were wrong to be so dismissive of Christmas. Sometimes the things that seem most simple and inane, like the rules of arithmetic you learned in elementary school, can reveal unexpected depth and beauty when you're willing to push beyond the surface. You think back to Christmases of your past -- moments when, in celebrating the chaos and complexity of your most close and basic relationships, you found greater value than you'd imagined could exist. That's what Christmas is all about.

Satisfied with your newfound understanding, you change into pajamas, climb into bed, and drift off to sleep.

## The Ghost of Christmas's Order Type

You find yourself back among that nonstandard model, numbers swirling around like flurries of snow. But now, a new figure stands before you. He's a small, bespectacled man, impeccably dressed, and carrying a measuring tape. His expression is stern -- his eyes seem to pierce within you and judge the magnitude of your soul.

<center>
<figure>
    <img src="/assets/tennenbaum/ghost_of_order_type.png"
         alt="The Ghost of Christmas's Order Type"
         width ="60%">
</figure>
</center>

> "I am the ghost of Christmas's Order Type. I come to show you the flaws in your presumptions, so that you might become a greater person than you are now."

As he speaks, the numbers around you begin to fall to the ground, organizing themselves in order. You see 0, 1, 2, 3, $\dots$, falling into place one-after-the-other. But then, above all of them, you see another line of numbers also stretching out to infinity. And another above that, and another between those two, $\dots$

"What is this?", you ask, overwhelmed, "why are there so many?".

The ghost explains to you in measured tones the consequences of having a natural number bigger than all the usual ones. Repeatedly taking successors (which the axioms guarantee exist -- since every ordinary natural number has a successor, every non-standard one must too) of this number $c$, we find another copy of the natural numbers, bigger than all of the usual ones. But then $2c$ must be bigger even than all of those, since $c + c$ is greater than $c + n$ for any usual natural number $n$, so we get a third copy of the natural numbers on top, and another on top of that, etc. By similar logic, we have $n < \lfloor c/2 \rfloor$ and $\lfloor c/2 \rfloor + n < c$ for any $n$, so between any two copies of the naturals we can find another copy. So on and so forth, we find that this nonstandard model (assuming it's countable) must, in terms of its ordering, look like one copy of the natural numbers for every non-negative rational number[^5]. That is, if all you cared about was the ordering of numbers, you could biject them with tuples $(q \in \mathbb{Q}^+, n \in \mathbb{N})$ such that $x < y$ if and only if $q_x < q_y$ or $q_x = q_y$ and $n_x < n_y$. 

You're a little surprised -- before you'd really thought through the implications, you kinda imagined it'd be possible to have just one element larger than all the others, but now you see that there must necessarily be infinitely many layers on top of and between each other.

As the dream disolves to wakefulness, you once again find yourself thinking about the meaning of Christmas. You'd thought you had the answer, but now you're not so sure. After all, Christmas can mean so many different things to people -- from a commercially-driven festival of retail, to an excuse to spend time in light-hearted fun with family, to a serious day of Christian worship. Who are you to say that the "true meaning" is a single sentiment you can isolate as greater than all the others? Sheepishly, you realize that to actually understand the true meaning of Christmas will require making sense of the relationships between all of these different layers of values and beliefs -- the task that lies ahead will not be an easy one. You decide it that, in that case, it will probably have to wait until morning.

## The Ghost of Christmas's Recursive Structure

As soon as you close your eyes, you see a new figure. It's been waiting for you. Although it's shaped like a human form, you can tell this is no creature of flesh and blood -- its skin is made of metal, and in place of eyes it has two glowing LEDs. With a mechanical whir, it dispenses a stream of ticker tape from it's mouth, which after a moment of hesitation you walk over and read.

<center>
<figure>
    <img src="/assets/tennenbaum/ghost_of_recursive_structure.png"
         alt="The Ghost of Christmas's Recursive Structure"
         width ="60%">
</figure>
</center>

> "\texttt{I am the ghost of Christmas's Recursive Structure. I come to teach you the limits of your abilities.}"

Now you're back in your room, looking at your computability theory textbook. The ghost scrolls up to Exercise 1.6.26: prove the existence of inseperable computationally enumerable sets. You remind yourself what this means. A set is _computationally enumerable_ (c.e.) if there's some algorithm that, in the course of its runtime, eventually prints out exactly every element of the set. Two sets $A$ and $B$ are _seperable_ if there's an algorithm (guaranteed to halt on every input) that, given an element of $A$ always outputs \texttt{0}, and given an element of $B$ always outputs \texttt{1} (but could output whatever it wants on inputs that are neither in $A$ nor $B$). $A$ and $B$ are _inseperable_ otherwise. 

The solution to the problem is to let $A$ be the set of strings that, when treated as python programs and run on their own code, halt and output \texttt{1}, and $B$ be the set of strings that, when treated as python programs and run on their own code, halt and output something else. Note that not every string belongs to either of these sets -- some of them don't even halt at all, or aren't valid python programs -- but that these sets are disjoint.

Claim 1: $A$ and $B$ are both computationally enumerable. To enumerate $A$, we can simulate all programs on themselves in parallel (like described in [this post]()), and then print a program whenever it halts and outputs \texttt{0}. Same deal for $B$.

Claim 2: $A$ and $B$ are inseperable. Suppose some algorithm separated them -- let $e$ be a string encoding a python implementation of that algorithm. But now, consider running $e$ on itself. If it outputs \texttt{1}, then by definition of $A$ we have $e \in A$, and so it should have ouputted \texttt{0}. But if it outputs anything other than \texttt{1}, we have $e \in B$, so it should have outputted \texttt{0}. Since the algorithm is supposed to halt on every input (including its own code), this is a contradiction.

Ok, so a pair of c.e. sets can be inseperable. You're getting a little impatient -- is this robot guy just trying to waste your time? As if in response to that thought, it turns to you and begins printing out ticker tape again.

> "\texttt{TENNENBAUM'S THEOREM[^6]: No countable non-standard model of Peano Arithmetic can be computable. That is, for any way of labeling elements of the model with finite strings, there's no algorithm in general to compute the label of $n + m$ given $n$ and $m$.}"

"No!", you cry, "It can't be!". You'd just discovered the general structure of these models, and had been excited to learn about all these different worlds hiding behind your own -- only to be told that these worlds are, in some real sense, fundamentally uncomprehendable. You hear servos whir as the ghost turns its head to look you in the eyes. Out rolls a small strip of tape that reads simply "\texttt{PROOF:}".

### Arithmetic and Computability

Suppose we have some algorithm -- call it $P$. As it runs, it steps through a (possibly infinite) sequence of internal states, and on each step may print an output. I claim that we can express the statement "$P$ prints out $n$ after $m$ steps" as a first-order predicate[^7] on $n$ and $m$ in Peano arithmetic.

The first part of this argument is replacing the hazy notion of "algorithm" (or less hazy, but a little annoying to formally reason about, notion of "python program") with a model of computation with more nicely-representable interal states. I kinda like thinking about [counter machines](https://en.wikipedia.org/wiki/Counter_machine "wikipedia page on counter machines") since they feel like they're doing arithmetic, but you can also think about [Turing machines](https://en.wikipedia.org/wiki/Turing_machine "wikipedia page on Turing machines") -- in both cases, you can build Python interpreters (i.e. they're Turing complete), so we can imagine $P$ being encoded as a program for one of these simple models. The details are really not important -- what is important is that we can nicely represent the internal state of the machine at any given step in time with a natural number. "Nicely" meaning that, given two natural numbers $n$ and $m$, there's a simple arithmetic predicate to determine whether $P$ in state $n$ will transition to state $m$ on the next step[^8]. 

Now, the crucial part of this argument is to say that we can encode a finite _sequence_ of natural numbers as a single number. This isn't hard to do -- one way of converting a single number into a sequence would be "look at the binary representation of $x$, strip the leading 1 (so that it can start with a zero if you want), then chop that resulting $n$-bit binary number into $\sqrt{n}$ many $\sqrt{n}$-bit binary numbers[^9]". Note that this manipulation of binary strings can be done using division-with-remainder, which is something we can express using Peano arithmetic (to say $x \equiv y \text{ mod } z$, you can write $\exists k, x = y + z \cdot k$). 

To express "$P$ prints out $n$ after $m$ steps", we can now say "there exists an $x$ such that, treating $x$ as an encoding a sequence of states, we have 
- for all indices $i < m$ the $i+1$st state is a valid transition from the $i$th state,
- the 1st state is an empty tape, and
- the $m$th state represents printing $n$".

### Coding Sets with Natural Numbers

The next point is that we can treat any natural number $n$ as "coding" a set $S_n$ of natural numbers, by setting $S_n = \lbrace i \in \mathbb{N} \colon \text{ the } i\text{th prime divides }n\rbrace$. It's clear that, for any finite set $S$, there exists a natural number coding that set, just by multiplying together the relevant primes. But, if we're in a non-standard model, we might have some infinite sets that are _also_ coded in this way -- there can be numbers with infinitely many prime factors. This idea is going to be the key tool in our proof of Tennenbaum's theorem.

Because every finite set is coded by some natural number, and because we saw above that we could represent "$P$ prints out $n$ after $m$ steps" as a first-order predicate, the following is a true first-order statement in the standard model of Peano Arithmetic (i.e. the ordinary natural numbers):

> For every $n$ there exists an $x$ such that, for all $i$, $i \in S_x$ if and only if $P$ prints out $i$ within $n$ steps.

That is, for any finite prefix of $P$'s computation time, there exists a natural number $x$ coding the set of all its outputs so far. Now, here's where we'll reference the existence of inseperable c.e. sets. Let $A$ and $B$ be a disjoint pair of c.e. sets, enumerated by programs $P_A$ and $P_B$ respectively, that are inseperable. Since the sets are disjoint, we can modify the above statement to be:

> For every $n$ there exists an $x$ such that, for all $i$, $i \in S_x$ if $P_A$ prints out $i$ within $n$ steps, and $i \not\in S_x$ if $P_B$ prints out $i$ within $n$ steps.

Again, this is true whenever $n$ is an ordinary natural number, because all the sets we're dealing with are finite, and we can code any finite set. But if we're thiking of the ordinary natural numbers as an initial segment of a larger model of PA, is this also true for any of the larger elements of the model? If not, we have a problem: the ordinary natural numbers (thought of as a subset of this larger model) are closed under taking successor. So, we've found a property that holds for 0, and is preserved by taking successors (since for the ordinary natural numbers it always holds, and for everything else it never does), but doesn't hold for every number. This contradicts our induction axiom! So, we can find some element of our model -- let's call it $e$ for "evil" because it's gonna help us get a contradiction -- that's larger than any ordinary natural number, but that satisfies the above statement. Since $A$ is precisely the set of values printed by $P_A$ in a finite number of steps, and $B$ is precisely the set of values printed by $P_B$ in a finite number of steps, this means that in particular that

> $A \subseteq S_e$, $B \subseteq \overline{S_e}$.

The final step will be to use this $e$ -- which we now know must exist -- as a "cheat code" to let us algorithmically separate $A$ and $B$[^10].

### Finishing the Proof

Ok, now to put it all together. Suppose someone comes to us with an $n$, and wants us to decide whether $n \in A$ or $n \in B$ (they don't care what we say if neither of those cases holds). Fortunately, we have access to a countable nonstandard model of Peano Arithmetic in which we can compute addition. The labels of elements are finite strings, so we can hardcode the names of $1$ and $e$ (the element described in the previous section) into the algorithm. Now, we can algorithmically find the $n$th prime $p_n$. At this point, we can iterate over all labels $L$, and for each one check for each $i<p_n$ whether (in the nonstandard model):

$L + \dots$ ($p_n$ times) $\dots L + 1 + \dots$ ($i$ times) $\dots 1 = e$.

If we're searching over all labels $L$, we must eventually find one where one of these holds. Then, we know that $p_n$ divides $e$ if and only if the $i$ we found was $0$. Since we know $A \subseteq S_e$ and $B \subseteq \overline{S_e}$, this is an always-halting algorithm that lets us decide between $n \in A$ and $n \in B$, which is a contradiction[^11]. $\ensuremath{\square}$

This proof makes you a little bit sad. There was so much you were hoping to do with these nonstandard models -- it would have been a lot of fun to play around with them, and maybe even try to construct ones where your favourite conjectures hold/fail in order to prove independence results -- but now you realize that a nonstandard model of Peano arithmetic isn't just something you can build and play with. It's something much more exotic and nebulous, something you know must exist, but will never truly understand. 

As you awake to Christmas morning, you find yourself filled with a strange sense of peace. Maybe you'll never know the true meaning of Christmas. Maybe it's a little silly to even say that it has one. But something can be real and beautiful even if you know you'll never be able to pin down exactly why or how. Filled with newfound holiday cheer, you cry out to the world at large: "Gödel bless us, every one!"

----

I got this content from a couple different places -- [these lecture notes](https://webspace.science.uu.nl/~ooste110/syllabi/peanomoeder.pdf), [these](https://web.mat.bham.ac.uk/R.W.Kaye/papers/tennenbaum/tennenbaum.pdf) [papers](https://www.logicmatters.net/resources/pdfs/TennenbaumTheorem.pdf), and the [sketch on wikipedia](https://en.wikipedia.org/wiki/Tennenbaum%27s_theorem). I first heard about Tennenbaum's theorem from my amazing set theory professor Henry Cohn last semester.

[^1]: Called "first-order" because we think about the "exists" and "for all" quantifiers as running only over _things_, and not over _properties of things_. That is, if you're describing numbers, you could say "there exists a natural number such that all larger numbers can be written as a sum of 3 binary pallindromes", but you couldn't say things like "for _any_ property of numbers, there exists a number with that property". Of course, while the former of these is [true](https://link.springer.com/article/10.1007/s00224-019-09929-9 "paper proving this statement"), the second is obviously false. But what I'm trying to illustrate here is that the first statement is one we would consider "first-order", because the quantifier only looks at the objects (numbers) themselves, as opposed to running over all properties of those objects, which we would call "second-order". Second-order logic is in some senses nice (in particular, it avoids the things mentioned in this post), but in some senses really not nice (the completeness and compactness theorems are no longer true). A take I would probably endorse is that second-order logic is basically cheating -- Quine famously called second-order logic "set theory in sheeps clothing", because quantifying over properties is basically the same as quantifying over all sets, which brings back a lot of the technical ickiness (incompleteness, etc) you get from building set theory. If you want to avoid such things being baked into your basic mathematical language (which most people would probably agree is better -- keep them out in the open where you can keep an eye on them), you instead define everything in terms of first-order logic. If you want to make a statement about all properties, you instead make a countably infinite number of statements, one for every property definable using first-order logic, which seems like a pretty similar thing to do (it still captures all "normal" properties like being prime or being a sum of pallindromes or whatever, just doesn't capture properties that would arise from arbitrary, undefinable sets). 

[^2]: The type of formal proof system I have in mind is something like "each line is either an axiom, or something that one of our basic rules of inference tells us follows from some of the previous lines". So you can't make use of more axioms than you have lines in your proof.

[^3]: You can think of $n$ here as being a shorthand for $S S S \dots$ ($n$ times) $ \dots S 0$, so that we don't have to add a bunch of extra symbols to the language. When I talk about the "language", I mean "what are the symbols used in our axioms, that a model would have to assign meanings to?". So, for the Peano axioms, we would ask the model to assign a specific number to $0$, and specific operations to $S$, $+$, and $\cdot$. If we were instead axiomatizing e.g. set theory, we might not need the model to assign some operation to correspond to $+$, but we would need it to fix a notion of set membership (which we could then use ourselves to define other things like addition).

[^4]: Wait, why can't I just add the sentence that every natural number is a finite successor of 0? Well, how would I say that? When I say "finite successor", I really mean "for every number, there exists some natural number $n$ so that it can be obtained by applying $S$ to $0$ $n$ times" -- but in order for this to make sense, you need to have a notion of natural number already. 

[^5]: In general, the argument I gave just says that we must have copies of the natural numbers where the ordering between them is dense, and has a left endpoint but no right endpoint. When the set is countable, though, [any dense ordering with a left endpoint but no right endpoint is isomorphic to $\mathbb{Q}$](https://en.wikipedia.org/wiki/Cantor%27s_isomorphism_theorem). I suppose you might not yet be convinced that these non-standard models can be countable at all, but they can. You can get this by something called [Downward Loewenheim-Skolem](https://en.wikipedia.org/wiki/L%C3%B6wenheim%E2%80%93Skolem_theorem) -- basically, as long as your language only has countably many symbols in it, you can build a model by only including one element for every existential statement in first-order logic, thus guaranteeing that everything you need to exist exists, but only adding a countable number of them.

[^6]: Yes, this name is the entire reason this post exists.

[^7]: 
<center>
<figure>
    <img src="/assets/tennenbaum/kylogic.png"
         alt="First-Order Predicate"
         width ="30%">
</figure>
</center>

[^8]: How would you write that predicate? Well, if you're using Turing machines, you can represent internal states as (number $< 100$ representing the finite control) $+ 100 \cdot $ (number representing a 4-ary encoding of the tape state). I say 3-ary so that you can have a special symbol for the tape head. Then, you can index into the tape by doing division and remainders, which you can express in PA. So, you just express that, for every entry of the tape, either the tape head wasn't there and it is unchanged, or the tape head was there, and the local transition looks valid given the old state and the entry on the tape (and also the state transition was valid). If you're feeling uneasy about how this sort of thing would work precisely, it could be a good exersize to try and actually explicitly write out such a formula.

[^9]: Ok, this will actually work for us, but it's maybe kinda unfortunate that the length of the sequence is related to an upper bound on the size of the elements. To fix this, we can just say "ignore every term in the sequence whose binary representation is all 1s" -- now, we can encode short sequences of big numbers by padding with 1s. Again, details are very unimportant, as long as you get the gist. A slightly different (and more standard) way of doing this type of encoding is to use the [Chinese remainder theorem](https://en.wikipedia.org/wiki/G%C3%B6del%27s_%CE%B2_function "wikipedia page for Godel's beta function").

[^10]: It's worth unpacking what's happening here. Why are we doing all this stuff with computationally inseperable sets, as opposed to just saying we can find an element that codes for _exactly_ $A$? Well, we know that $A$ consists of all the values you get by running $P_A$ for some ordinary natural number of steps. But when we encode the property "$P$ prints out $n$ after $m$ steps" in Peano arithmetic, we allow for nonstandard elements to be plugged in as $m$ -- it's maybe not clear what that means in terms of the program, but it does get assigned some truth value by our formula. So, since $e$ is larger than all natural numbers, we know that $S_e$ contains $A$, but it might also contain some other weird stuff that somehow corresponds to "running the program for more than a finite number of steps". Hence why we talk about inseperable sets -- $S_e$ might contain other weird stuff, but we can make sure it definitely never gets anything from $B$.

[^11]: You might notice that this argument only really shows that there can't be a labeling that's a bijection with $\mathbb{N}$. That is, you could imagine that you had some computable functions $+_M$ and $\cdot_M$ acting on $\mathbb{N}$, such there's some substructure isomorphic to a nonstandard model of PA, but that the subset of $\mathbb{N}$ corresponding to that substructure isn't computably enumerable. Then, the argument I presented doesn't work -- you might find a label $L$ such that $L \cdot_M p_n = e$, but where that label doesnt't actually correspond to an element of the model. I'm not sure whether there's a way to rule such a structure out, or whether there's an obvious reason it _should_ exist -- I would be very interested if somebody sees the answer here.
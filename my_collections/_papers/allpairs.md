---
title:  "The Limits of Black-Box Reductions for All-Pairs Detection"
link: "/assets/papers/allpairs.pdf"
linktext: "Link to the paper"
order: 8
conference: "preprint"
authors: "with Virginia Vassilevska Williams and Zoe Xi"
notes: "This was a fun project, but in retrospect I maybe ended up spending much more time on some gross quantitative details (most of which didn't even end up making it into this version) than I did thinking about the simple philosophy stuff that ended up being imo the most important message here. So it goes."
fable: "Now that he's footloose and fancy-free, Theo has decided that there's no better way to get back into the groove high society than by judging the upcoming royal dance contest. (After resolving that last incident he's got to keep strutting his stuff as an expert contest judge, right?) But things seem already to have gotten off on the wrong foot, even though he's just trying to come up with the list of competitors. 
The issue is: while it takes two to tango, **it takes three to triango**.
That's right, the season's hottest new dance craze, and the main event of this year's contest, is for groups of _three_ as opposed to couples.
Which wouldn't be a problem, except that when Theo sends his lackeys to court events they always ask \"are there any groups present that want to compete together?\", but then pass around the same sign-up sheets from last year, which have only two spots for names. So, as a result, Theo only learns the first two people in each triple!
To make things worse, the royal ball happens over multiple rounds, so a given person can enter several different times with several different groups.
Is there any way he can piece together the full list of competing triples without sending his lackeys to a ridiculous number of court gatherings? People are already starting to get annoyed at being asked so many times, and Theo doesn't want to step on anyone's toes...
"
---

Given $3$ sets of objects and some tripartite relation $R$, we consider the problem of determining for each pair of objects whether there exists a third object satisfying the relation with them.
For many specific relations $R$, an appropriate form of matrix product allows us to solve this "all-pairs" detection problem just as efficiently as we could detect whether a _single_ relation-satisfying triple exists.
We study the extent to which all-pairs detection can be used to generically solve other problems (and vice-versa), defining a natural corresponding hypergraph query model and proving upper and lower bounds on the cost of listing and counting hyperedges.

Our results have implications in fine-grained complexity. Our positive results yield new reductions between several classes of triangle and matrix problems --- for instance, we demonstrate that an $O(n^{2.53})$ algorithm for computing the equality product of two $n\times n$ matrices would imply an improvement on known algorithms for computing boolean $(\min, +)$-product. Our negative results can be thought of as barriers against natural fine-grained proof techniques: we show that no appropriately "black-box" reductions are capable of demonstrating a tight equivalence between boolean matrix multiplication and triangle detection, a subcubic equivalence between triangle counting and binary integer matrix multiplication, or a tight equivalence between boolean matrix multiplication and listing $n^2$ triangles, despite the fact that all of these equivalences are conjectured to hold.

---
layout: post
title:  "Wasting Time Responsibly"
date:   2024-09-17 10:00:00 -0400
categories: jekyll update
excerpt: "A conjecture about finite automata which you, the reader, should solve for me"
---

## Fast ride in a short machine (DFAs)

I'm currently TAing for Mike Sipser's intro "Theory of Computation" class, and the kids are learning about finite automata. 
A [DFA](https://en.wikipedia.org/wiki/Deterministic_finite_automaton "wiki page for DFAs") ("deterministic finite automaton") is maybe the simplest interesting model of computation[^1]. 
The definition is as follows: the machine has some finite set of states $\lbrace 1,\dots, n\rbrace $, and some transition function $\delta:\ \lbrace 1,\dots,n\rbrace  \times \lbrace 0,1\rbrace  \to \lbrace 1,\dots,n\rbrace $.
It reads the bits of its input one-at-a-time from left to right, at each step updating its state based on its previous state and the current symbol, according to $\delta$.
An input is accepted if and only if, once its last bit has been read, the machine's final state belongs to a designated set of "accept" states.

One can show that a set of strings is the language (i.e. set of accepted strings) of some DFA if and only if it is specified by some [regular expression](https://en.wikipedia.org/wiki/Regular_expression "wiki page for regex"). Since you can write a regular expression for any finite set of strings, this means that any finite language has an associated DFA. However, the DFA required might be rather large. An example of an exercise I might give in recitation is the following:

> Problem: Show that, if an $n$-state DFA on alphabet $\lbrace 0,1 \rbrace$ has a language $L$ consisting of finitely many strings, then $\vert L \vert \leq 2^n$.

The solution is simple. If $L$ contains any string of length greater than $n$, then, in the course of the DFA reading the string, there must be some state that occurs more than once. But then, if we modify that string by repeating the whole segment in between those two occurences as many times as we want, the poor machine won't be able to tell the difference --- it'll just keep going around the same old loop a bunch times, until it finally gets out the other end and accepts. This idea is known as the "[pumping lemma](https://en.wikipedia.org/wiki/Pumping_lemma_for_regular_languages "wiki page for pumping lemma")". Since one can generate an accepted string of unbounded length this way, this contradicts the assumption that $L$ is finite. So, every string in $L$ must have length at most $n$, and thus there can be at most $2^n$ many of them.

## Strike that. Reverse it. (2DFAs)

## So much time and so little to do. ($\mathsf{BP^*L}$)

<hr class = "header-line">

[^1]: Opinions may vary depending on what you count as a "model of computation", and what you count as "interesting".

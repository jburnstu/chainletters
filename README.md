# ChainLetters (Working Title)

This is the development code-base for my personal project, ChainLetters (one of many working titles) -- a desktop (for now) app on which users create, write and submit stories, which are then sent on for other users to continue and branch off of.
Currently, the entire app is in development mode. I have used this project as a chance to keep my pre-existing Python / SQL skills sharp, and expand my knowledge of HTML / CSS / Javascrip, in particular JS-React.

The stack:
- PostgreSQL database (currently hosted on my own laptop, and managed via PGAdmin4) consisting of base tables and supporting views
- Accessed by a Django (Python) ORM and backend


## General Coding Comments

### Potential Employers
If you're here because of a link from a job application -- thank you for having a look at my code! While I've made a rough indication below where the code here isn't my own, it's somewhat in the nature of modding to copy a fair amount of code from the base-game, so sometimes this line gets blurred. For instance, the cards themselves are basically all copied from the same template, with differing permutations of lines of code taken from the base game.

In particular, the places where I've done the most "ground-up" coding are in the following sub-folders (note: all in src / main / java / sleepermod):
- patches: this is more or less all me (the Locator nested class in the Insert patches is fairly boilerplate though).
- actions(.core): this is a real mix, as even where code is borrowed from the decompiled base-game, it was often a lot of work to adapt it here.
  - for instance, the classes "RememberAction" and "Move" in actions.core are mostly my own;
  - whereas the class "ForgetAction" in actions.core was adapted from the base game's "ExhaustAction". I've added the latter as "ReferenceExhaustAction", so that the line between adapting / copying is  hopefully clear.
- powers (note this is "sleepermod / powers", not "sleepermod / cards / powers"): the functional code here is more or less all me, although the structure of each file is prescribed by the mod template.

Also, all the abstract classes here (AbstractSleeperCard, AbstractSleeperPower, AbstractSleeperRelic) are my own work (although they're pretty basic obviously).

Therefore I'd recommend having a look in these folders, for the work I lay the strongest claim to :)

### Code Quality
I've been a bit cavalier with allowing warnings on my commits, because Intellij marks a lot of classes as "unused" and it didn't seem like a good use of time to annnotate everything to avoid this.

I've mostly been focusing on top-level functionality, ie "does the game work", over inherent code quality. In particular, I've slightly neglected modifiers on variables, eg "public / private / final" etc.. I'm going through now and trying to understand what would academically be best in each case, but overall this shouldn't affect how the code runs -- it just means there's places where you could in theory have an easier time breaking the code (intentionally or otherwise) by accessing a variable from a place you shouldn't be able to.

### Commenting
I am working through now and ensuring the comments in all the files are up-to-date. Tthere are quite a lot of files I copied and pasted as a starting point (eg all 75 cards!) so I found a couple of early comments that got erroneously copied all over the place.

In general I've gone fairly light on comments, as I feel the code is fairly self-explanatory *provided a knowledge of the game's base code*. I have just provided comments where I feel that even someone who understands how Slay The Spire itself is coded, would still need a pointer. I suggest the Slay The Spire BaseMod wiki (https://github.com/Alchyr/BasicMod/wiki) for a fuller understanding of the base game's code -- it's actually a tutorial for setting up the mod template, but it takes you through how the game handles its objects.

### Use of GitHub
Although I started this project with the intention of using the full branching capabilities of GitHub, I quickly realised this was overkill for a one-man project with a surprisingly linear development. Now that the mod is "finished", I might consider using branches for overall mechanical decisions I haven't yet settled to myself.

I have committed as often as necessary to save my progress on this project. The size of commits varies a lot, as in some cases moving a single package around caused a large number of files to update. One take-away for me would be to half all other development while I perform one of these moves, as it occasionally muddied the water of actual code changes vs. pacakge structure.

### Feedback and Future Updates
I have every intention of continuing to maintain and update this mod, albeit at a slower pace. I've reached out to friends and the modding community for feedback (although of course they can't see the code, so there'll be no feedback there per se).



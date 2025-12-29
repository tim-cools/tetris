Drunk 'n develop assignment by the Spirit. I tried to mimic the behavior from the [original Tetris](https://www.retrogames.cz/play_1751-DOS.php) behavior I used to play in DOS as much as possible.

No mobile support (yet). 

Tech: javascript, react, konva

Requirements: Jupiler (or S Artois, Leffe, Duvel, ...)

Soundtrack: https://www.youtube.com/watch?v=ZqkzfrxJR6k , https://www.youtube.com/watch?v=l_Tba26wHSY (the pause before the stop had more impact ;) ), ...

# run

install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
install [node.js](https://nodejs.org/en/download)

[open terminal](https://www.google.com/search?q=open+terminal+different+operating+systems)

and execute (per line):

```
git clone https://github.com/tim-cools/tetris.git
cd tetris
yarn install
```

Start tetris:

```
yarn start
```

# todo

Obviously needs refactoring.
- [ ] refactor Field.js into separated component files, extract consts into state
- [ ] make responsive
- [ ] add mobile support
- [ ] add ui design, animation and style
- [ ] extract create grid method and some other code duplication

### Click Me Fast
A simple multi-player game, built with React, Flux and Firebase.
The goal of the game is to eliminate the boxes faster than your opponent does by simply clicking on them.
[Play it!](http://maximus8891.github.io)

![Click Me Fast gameplay](https://raw.githubusercontent.com/maximus8891/clickmefast/master/docs/game.gif)

### Architecture
Lobby dispatches Actions, which a captured by FireConnectorStore. FireConnectorStore communicates to Firebase and invokes callbacks, which dispatch Actions processed by PlayersStore. Finally, Lobby consumes the state of PlayersStore.
```
+-----------------------------+
|   Lobby (React component)   +--------------------+
+-------------^---------------+                    |
              |                     +--------------v--------------+      +-------------------+
              |                     |      FireConnectorStore     <------>      Firebase     |
              |                     +---------------+-------------+      +-------------------+
+-------------+---------------+                     |
|        PlayersStore         <---------------------+
+-----------------------------+
```

##### Managing communication between players
The list of players is represented by an array in Firebase. When a player initiates the queuing state, it searches for the first player in the list with the queuing state. If the search is unsuccessful - no one is queuing yet - it waits for a callback from a player who enters the queuing state next. Having found the first queuing player, the second player sets the states of its own Firebase entry and the opponent's one to _game_. The first player received the update and prepares its stores for the game.

During the game both players observe own and opponent's changes in Firebase and reflect them accordingly on the boards.

### Requirements
Compatible with Chrome, uses ES2015 features.
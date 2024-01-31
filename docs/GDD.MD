# Game Design Document - CodeHop

# Specifications
## Concept
The aim of CodeHop is to learn basic programming through puzzle solving. 

## TODO: Platform
The game is aimed to be played in a web platform, but due to the nature of the project, it can be played offline and on other devices.

## Game Structure
The game is divided into 2 sections, a level player and a level editor (level creator).


### Level Player
The level player is used to play either offical levels or community-created levels. The screen is divided into a programming zone, where the where the player interacts with the "code blocks", and the level "board", where the result of the code is animated once played.

#### Players
![Player Spritesheet](../public/assets/sprites/default/player.png)

// TODO: complete

#### Actions
The actions are marked as blocks, distributed in intuitive sections, which the player can then use to create chunks of code that
the game will run to solve the puzzle presented. The player is only allowed to manipulate existing blocks and to execute them.

##### Use code block
The user can add a block from a sidebar to the workspace and connect it to a starting block. The blocks can be interconnected to represent more advanced programming conectps (e.g. loops, conditionals, etc...).

##### Run code
The user can run the code, which will play the result movement and animation in the board. If the objective is reached a message is shown 


#### Objective
The objective of the game is to make each player character reach the chest with matching colors, without any of them losing in the process.
A player loss is caused when:
1. There are no more instructions to run and any player hasn't reached their respective chest, or
2. The player avatar died in an obstacle, such as spikes or skeletons, or
3. A timeout is triggered (due to infinite loop or other conditions).

### Level Editor
The Level Editor allows users to create levels and upload them to the community once completed. The screen is divided into a sprite selector and an empty board. The sprite selector has 2 tabs, a background sprite selector and a game object selector.

#### Actions
##### Add object to level
Users can drag and drop both background and game object sprites from the selector to the board to add them to the level.

##### Change board size
Users can add or remove rows and columns to make the board smaller or larger.

##### Test Level
Users can play the level to see if it's completabale. If it's not completabale they can continue editing it.

##### Upload Level
Users can save and publish the level to the community or specific users/groups once it's been successfully tested.


## Graphics
The graphics are implemented through Phaser's built-in arcade graphics engine, which allows for webGL rendering of most of our game assets.

## Data storage
To store data we use a relation
smbdr() metsys tnemeganam esabatad l
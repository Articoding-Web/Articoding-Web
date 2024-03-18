import * as Phaser from "phaser";
import Board from "./Classes/EditorBoard";
import ArticodingObject from "./Classes/ArticodingObject";

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;

export default class LevelEditor extends Phaser.Scene {
  selectedIcon: HTMLImageElement;
  board: Board;

  constructor() {
    super("LevelEditor");
  }

  init(): void {
    // TODO: get leveldata  (if passing from player to editor)
  }

  preload(): void {
    const themePath = `assets/sprites/default`;
    this.load.setBaseURL(themePath);
    this.load.multiatlas("player", "player.json");
    this.load.image("chest", "chest.png");
    this.load.multiatlas("trap", "trap.json");
    this.load.image("wall", "wall.png");
    this.load.multiatlas("enemy", "enemy.json");
    this.load.multiatlas("background", "background.json");
  }

  create(): void {
    this.board = new Board(this, NUM_ROWS, NUM_COLS);

    this.createBackgroundSelectors();
    this.createObjectSelectors();

    document.querySelectorAll(".selector-icon").forEach(icon => {
      icon.addEventListener("click", (e) => {
        this.selectedIcon?.classList.remove("border");

        if(this.selectedIcon?.id === (<HTMLImageElement>e.target).id)
          this.selectedIcon = undefined;
        else {
          this.selectedIcon = <HTMLImageElement>e.target;
          this.selectedIcon.classList.add("border");
        }
      });
    }, this);
  }

  createObjectImage(key, frame?): HTMLDivElement  {
    let col = document.createElement('div');
    col.classList.add("col", "text-center");

    const url = this.textures.getBase64(key, frame);
    const img = document.createElement('img');
    img.src = url;
    img.style.width = 32 + "px"; // Set width
    img.style.height = 32 + "px"; // Set height
    img.id = `${key}-${frame}`;
    img.classList.add(frame, "selector-icon", "border-primary", "border-3");

    col.appendChild(img);
    return col;
  }

  createBackgroundSelectors() {
    let bgSelector = document.querySelector("#pills-background .row");

    let bgFrameNames = this.textures.get("background").getFrameNames();
    for(let frame of bgFrameNames) {
      bgSelector.appendChild(this.createObjectImage("background", frame));
    }
  }

  createObjectSelectors() {
    let objSelector = document.querySelector("#pills-objects .row");

    // Player
    objSelector.appendChild(this.createObjectImage("player"));

    // Chest
    objSelector.appendChild(this.createObjectImage("chest"));

    // Trap - disabled
    objSelector.appendChild(this.createObjectImage("trap"));

    // Trap - enabled
    objSelector.appendChild(this.createObjectImage("trap", "3.png"));

    // Wall
    objSelector.appendChild(this.createObjectImage("wall"));

    // Enemy
    objSelector.appendChild(this.createObjectImage("enemy"));
  }

  getSelectedIcon(): {texture: string, frame: string | undefined } {
    if(!this.selectedIcon) {
      return {texture: undefined, frame: undefined};
    }
    let data = this.selectedIcon.id.split("-");
    return {texture: data[0], frame: (data[1] === "undefined" ? undefined : data[1])};
  }
}
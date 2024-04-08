import * as Phaser from "phaser";
import Board from "./Classes/EditorBoard";

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1;
const ZOOM_AMOUNT = 0.05;

export default class LevelEditor extends Phaser.Scene {
  selectedIcon: HTMLImageElement;
  board: Board;

  constructor() {
    super("LevelEditor");
  }

  // TODO: pasar nivel y cargarlo
  init(): void {
    
  }

  preload(): void {   
    const assetPath = `assets`;
    const spritePath = `/sprites/default`;

    // TODO: comprobar que la textura no esté impórtada antes de cargarla

    this.load.setBaseURL(assetPath);
    this.load.multiatlas("player", "sprites/default/player.json", spritePath);
    this.load.image("exit", "sprites/default/exit.png");
    this.load.image("chest", "sprites/default/chest.png");
    this.load.multiatlas("trap", "sprites/default/trap.json", spritePath);
    this.load.image("wall", "sprites/default/wall.png");
    this.load.multiatlas("enemy", "sprites/default/enemy.json", spritePath);
    this.load.multiatlas("background", "sprites/default/background.json", spritePath);

    this.load.image("green", "ui/button_green.png");
    this.load.image("green-pressed", "ui/button_green_pressed.png");
    this.load.image("red", "ui/button_red.png");
    this.load.image("red-pressed", "ui/button_red_pressed.png");
    this.load.image("plus", "ui/plus.png");
    this.load.image("plus-pressed", "ui/plus_pressed.png");
    this.load.image("minus", "ui/minus.png");
    this.load.image("minus-pressed", "ui/minus_pressed.png");
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
          (<HTMLInputElement>(document.getElementById('paintbrush'))).checked = true;
          (<HTMLInputElement>(document.getElementById('eraser'))).checked = false;
        }
      });
    }, this);

    document.getElementById("eraserBtn").addEventListener("click", () => {
      this.selectedIcon?.classList.remove("border");
    });

    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;

      const selectedTool = (<HTMLInputElement>(document.querySelector('input[name="editor-tool"]:checked')))?.id;
      if(selectedTool !== "movement")
        return;

      this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
      this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
    });

    this.input.on('wheel', this.cameraZoom, this);
    // TODO: Remove magic number
    this.cameras.main.setBounds(0, 0, this.cameras.main.width * 1.2, this.cameras.main.height * 1.2);

    document.getElementById("saveEditorLevel").addEventListener("click", () => this.saveLevel())
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
    let bgSelector = document.getElementById("background-selector");

    let bgFrameNames = this.textures.get("background").getFrameNames();
    for(let frame of bgFrameNames) {
      bgSelector.appendChild(this.createObjectImage("background", frame));
    }
  }

  createObjectSelectors() {
    let objSelector = document.getElementById("object-selector");

    // Player
    objSelector.appendChild(this.createObjectImage("player"));

    // Exit
    objSelector.appendChild(this.createObjectImage("exit"));

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

  saveLevel() {
    let levelJSON = this.board.toJSON();
    console.log(levelJSON);
    console.log(JSON.stringify(levelJSON));
  }

  cameraZoom(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    const selectedTool = (<HTMLInputElement>(document.querySelector('input[name="editor-tool"]:checked')))?.id;
    if(selectedTool !== "movement")
      return;

    if (deltaY > 0) {
      this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - ZOOM_AMOUNT, MIN_ZOOM, MAX_ZOOM);
    }
    if (deltaY < 0) {
      this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + ZOOM_AMOUNT, MIN_ZOOM, MAX_ZOOM);
    }
  }
}
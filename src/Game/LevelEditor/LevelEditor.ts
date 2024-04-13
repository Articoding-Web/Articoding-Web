import * as Phaser from "phaser";
import Board from "./Classes/EditorBoard";
import * as bootstrap from 'bootstrap';

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1;
const ZOOM_AMOUNT = 0.05;

export default class LevelEditor extends Phaser.Scene {
  selectedIconId: string;
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

  getPaintBrushContent() {
    console.log("getting content");
    return `<h5 class="border-bottom">Background</h5>
            <div id="background-selector" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2">
              ${this.createBackgroundSelectors()}
            </div>
            
            <h5 class="border-bottom mt-2">Objects</h5>
            <div id="object-selector" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-2">
              ${this.createObjectSelectors()}
            </div>`
  }

  create(): void {
    this.board = new Board(this, NUM_ROWS, NUM_COLS);

    const paintbrushPopoverTrigger = document.getElementById("paintbrushContent");
    const popover = new bootstrap.Popover(paintbrushPopoverTrigger);
    popover.setContent({ '.popover-body': this.getPaintBrushContent.bind(this) })
    paintbrushPopoverTrigger.addEventListener("shown.bs.popover", () => {
      document.querySelectorAll(".selector-icon").forEach(icon => {
        icon.addEventListener("click", (e) => {
          document.getElementById(this.selectedIconId)?.classList.remove("border");

          this.selectedIconId = (<HTMLImageElement>e.target).id;
          (<HTMLImageElement>e.target).classList.add("border");
          (<HTMLInputElement>(document.getElementById('paintbrush'))).checked = true;
          (<HTMLInputElement>(document.getElementById('eraser'))).checked = false;
        });
      }, this);
    });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = Array.from(tooltipTriggerList).map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    document.getElementById("eraserBtn").addEventListener("click", () => {
      this.selectedIconId = undefined;
      popover.hide();
    });
    document.getElementById("cameraBtn").addEventListener("click", () => {
      popover.hide();
    });

    this.input.on('pointermove', this.cameraMove, this);
    this.input.on('wheel', this.cameraZoom, this);
    // TODO: Remove magic number
    this.cameras.main.setBounds(-this.cameras.main.width / 2, -this.cameras.main.height / 2, this.cameras.main.width * 2, this.cameras.main.height * 2);

    document.getElementById("saveEditorLevel").addEventListener("click", () => this.saveLevel())
  }

  createObjectImage(key, frame?): string {
    const url = this.textures.getBase64(key, frame);
    return `<div class="col text-center">
              <img src="${url}" width="32" height="32" id="${key}-${frame}" class="${frame} ${this.selectedIconId == `${key}-${frame}` ? "border" : ""} selector-icon border-primary border-3">
            </div>`;
  }

  createBackgroundSelectors(): string {
    let bgFrameNames = this.textures.get("background").getFrameNames();
    let bgSelector = "";
    for (let frame of bgFrameNames) {
      bgSelector += this.createObjectImage("background", frame);
    }

    return bgSelector;
  }

  createObjectSelectors(): string {
    let objSelector = "";

    // Player
    objSelector += this.createObjectImage("player");

    // Exit
    objSelector += this.createObjectImage("exit");

    // Chest
    objSelector += this.createObjectImage("chest");

    // Trap - disabled
    objSelector += this.createObjectImage("trap");

    // Trap - enabled
    objSelector += this.createObjectImage("trap", "3.png");

    // Wall
    objSelector += this.createObjectImage("wall");

    // Enemy
    objSelector += this.createObjectImage("enemy");

    return objSelector;
  }

  getSelectedIcon(): { texture: string, frame: string | undefined } {
    if (!this.selectedIconId) {
      return { texture: undefined, frame: undefined };
    }
    let data = this.selectedIconId.split("-");
    return { texture: data[0], frame: (data[1] === "undefined" ? undefined : data[1]) };
  }

  saveLevel() {
    let levelJSON = this.board.toJSON();
    console.log(levelJSON);
    console.log(JSON.stringify(levelJSON));
  }

  cameraMove(pointer) {
    if (!pointer.isDown) return;

    const selectedTool = (<HTMLInputElement>(document.querySelector('input[name="editor-tool"]:checked')))?.id;
    if (selectedTool !== "movement")
      return;

    this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
    this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
  }

  cameraZoom(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    const selectedTool = (<HTMLInputElement>(document.querySelector('input[name="editor-tool"]:checked')))?.id;
    if (selectedTool !== "movement")
      return;

    if (deltaY > 0) {
      this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom - ZOOM_AMOUNT, MIN_ZOOM, MAX_ZOOM);
    }
    if (deltaY < 0) {
      this.cameras.main.zoom = Phaser.Math.Clamp(this.cameras.main.zoom + ZOOM_AMOUNT, MIN_ZOOM, MAX_ZOOM);
    }
  }
}
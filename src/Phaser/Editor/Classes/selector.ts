import * as Phaser from 'phaser';
import 'phaser3-rex-plugins/plugins/menu-plugin.js';
//TODO esto tiene que heredar de sizer
export default class Selector {
    private scene: Phaser.Scene;
    private menu: any;
    private options: string[];
    private onSelect: (option: string) => void;

    constructor(scene: Phaser.Scene, options: string[], onSelect: (option: string) => void) {
        this.scene = scene;
        this.options = options;
        this.onSelect = onSelect;
        //tal vez deberi tener un callback para cuando se crea el menu
        this.createMenu();
    }

    private createMenu() {
        const menuConfig = {
            x: 0,
            y: 0,
            width: 200,
            height: 200,
            orientation: 'y',
            items: this.options.map(option => {
                //opciones por defecto son botones... no se com osolventar eso
                return {
                    text: this.scene.add.image("item","/"),
                    setValueCallback: () => {
                        this.onSelect(option);
                    }
                };
            })
        };

        this.menu = this.scene.rexUI.add.menu(menuConfig);
        this.menu.layout();
    }

    public show(x: number, y: number) {
        this.menu.show(x, y);
    }

    public hide() {
        this.menu.hide();
    }
}

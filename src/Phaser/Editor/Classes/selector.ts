import * as Phaser from 'phaser';
import 'phaser3-rex-plugins/plugins/menu-plugin.js'; //tal vez no haya que implementar esto
//TODO esto tiene que heredar de sizer

export default class Selector {
    private scene: Phaser.Scene;
    private menu: any;
    private options: string[];
    const Random = Phaser.Math.Between;
    //TODO ajustar
    const COLOR_PRIMARY = 0x4e342e;
    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;
    private onSelect: (option: string) => void;
    private gridTable: any;
    constructor(scene: Phaser.Scene, options: string[], onSelect: (option: string) => void) {

        this.scene = scene;
        this.scene.load.scenePlugin({key: 'rexuiplugin', url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', sceneKey: 'rexUI'});  

        this.options = options;
        this.onSelect = onSelect;
        //tal vez deberi tener un callback para cuando se crea el menu
         this.init();
    }
           
        
        private init() {
            const scrollMode = 0; // 0:vertical, 1:horizontal
            this.gridTable = this.scene.add.rexGridTable({
                x: 400,
                y: 300,
                width: (scrollMode === 0) ? 300 : 420,
                height: (scrollMode === 0) ? 420 : 300,

                scrollMode: scrollMode,

                background: this.scene.add.rexRoundRectangleCanvas(0, 0, 20, 10, 10, this.COLOR_PRIMARY),

                table: {
                    cellWidth: (scrollMode === 0) ? undefined : 60,
                    cellHeight: (scrollMode === 0) ? 60 : undefined,

                    columns: 2,

                    mask: {
                        padding: 2,
                    },

                    reuseCellContainer: true,
                },

                slider: {
                    track: this.scene.add.rexRoundRectangleCanvas(0, 0, 20, 10, 10, this.COLOR_DARK),
                    thumb: this.scene.add.rexRoundRectangleCanvas(0, 0, 0, 0, 13, this.COLOR_LIGHT),
                },

                mouseWheelScroller: {
                    focus: false,
                    speed: 0.1
                },

                header: this.scene.rexUI.add.label({
                    width: (scrollMode === 0) ? undefined : 30,
                    height: (scrollMode === 0) ? 30 : undefined,

                    orientation: scrollMode,
                    background: this.scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, this.COLOR_DARK),
                    text: this.scene.add.text(0, 0, 'Header'),
                }),

                footer: GetFooterSizer(this, scrollMode),

                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,

                    table: 10,
                    header: 10,
                    footer: 10,
                },

                createCellContainerCallback: function (cell, cellContainer) {
                    var scene = cell.scene,
                        width = cell.width,
                        height = cell.height,
                        item = cell.item,
                        index = cell.index;
                    if (cellContainer === null) {
                        cellContainer = this.scene.rexUI.add.label({
                            width: width,
                            height: height,

                            orientation: scrollMode,
                            background: this.scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, this.COLOR_DARK),
                            icon: this.scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                            text: this.scene.add.text(0, 0, ''),

                            space: {
                                icon: 10,
                                left: (scrollMode === 0) ? 15 : 0,
                                top: (scrollMode === 0) ? 0 : 15,
                            }
                        });
                        console.log(cell.index + ': create new cell-container');
                    } else {
                        console.log(cell.index + ': reuse cell-container');
                    }

                    //ESTOY TESTEANDO LOS BOTONES
                    cellContainer.setMinSize(width, height); 
                    cellContainer.getElement('text').setText(item.id);
                    cellContainer.getElement('icon').setFillStyle(item.color);
                    cellContainer.getElement('background').setStrokeStyle(2, this.COLOR_DARK).setDepth(0);
                    return cellContainer;
                },
                items: CreateItems(100)
            })
                .layout();

           //NO TOCAR this.print = this.add.text(0, 0, '');
        }
    

    CreateItems(count: number): any[] {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({
                id: i,
                color: this.Random(0, 0xffffff)
            });
        }
        return data;
    }

    GetFooterSizer(scene: Phaser.Scene, orientation: number): any {
        return this.scene.rexUI.add.sizer({
            orientation: orientation
        })
            .add(
                CreateFooterButton(scene, 'Reset', orientation),   // child
                1,         // proportion
                'center'   // align
            )
            .add(
                CreateFooterButton(scene, 'Exit', orientation),    // child
                1,         // proportion
                'center'   // align
            )
    }
    //NOTA: pongo any porque las clases de rexUI dan error
    CreateFooterButton(scene : Phaser.Scene, text: String, orientation: number): any {
        return this.scene.rexUI.add.label({
            height: (orientation === 0) ? 40 : undefined,
            width: (orientation === 0) ? undefined : 40,
            orientation: orientation,
            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, this.COLOR_DARK),
            text: scene.add.text(0, 0, text),
            icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, this.COLOR_LIGHT),
            align: 'center',
            space: {
                icon: 10
            }
        });
    }

    //UTILIZAR ESTO PARA CREAR LOS BOTONES, llamado N veces desde CreateItems
    createButton(icon: String) : rexUI.Label{
        const iconStyle = {
            key: icon
        };
         let buttonLabel = this.scene.rexUI.add.label({
            width: 32,
            height: 32,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 2, this.COLOR_LIGHT),
            icon: this.rexUI.add.statesImage(iconStyle),
            space: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5 
            }
        });
        return buttonLabel;
    }

    // public show(x: number, y: number) {
    //     this.menu.show(x, y);
    // }

    // public hide() {
    //     this.menu.hide();
    // }
}

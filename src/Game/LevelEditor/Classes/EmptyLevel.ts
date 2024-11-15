import Level from "../../level";

export default <Level.Level>{
    "phaser": {
        "width": 0,
        "height": 0,
        "theme": "default",
        "layers" : {
            "background" : {
                "spriteSheet": "background",
                "spriteSheetType": "multi",
                "objects": [],
                "depth": 0
            },
            "objects" : [],
            "players" : {
                "spriteSheet": "player",
                "spriteSheetType": "multi",
                "objects": [],
                "depth": 2
            },
        }
    },
    "blockly": {
        "toolbox": {
            "kind": "categoryToolbox",
            "contents": [
                {
                    "kind": "category",
                    "name": "Actions",
                    "colour": "#745ba5",
                    "contents": [
                        {
                            "type": "movement",
                            "kind": "block"
                        }
                    ]
                },
                {
                    "kind": "category",
                    "name": "Numbers",
                    "colour": "#0d44ba",
                    "contents": [
                        {
                            "type": "math_number",
                            "kind": "block"
                        }
                    ]
                }
            ]
        },
        "maxInstances": {
            "start": 1,
        },
        "workspaceBlocks": []
    }
};
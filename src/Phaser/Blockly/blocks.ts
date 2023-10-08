//custom blocks definition in JSON format:

export default [
    //create movement block, that takes a number and a direction (up down left right)
    {
        "type": "movement",
        "message0": "move %1 blocks %2",
        "args0": [
            {
                "type": "input_value",
                "name": "STEPS",
                "check": "Number"
            },
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    [
                        "up",
                        "UP"
                    ],
                    [
                        "down",
                        "DOWN"
                    ],
                    [
                        "left",
                        "LEFT"
                    ],
                    [
                        "right",
                        "RIGHT"
                    ]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60,
        "tooltip": "Moves the robot in the specified direction",
        "helpUrl": ""
    },
    //block [ACTION = YELLOW] to rotate, asks user to choose left or right, and how many times to rotate
    {
        "type": "rotate",
        "message0": "rotate %1 %2 times",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "DIRECTION",
                "options": [
                    [
                        "left",
                        "LEFT"
                    ],
                    [
                        "right",
                        "RIGHT"
                    ]
                ]
            },
            {
                "type": "input_value",
                "name": "TIMES",
                "check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60,
        "tooltip": "Rotates the robot in the specified direction",
        "helpUrl": ""
    },
    //block [ACTION = YELLOW] to change status of an object (robot, wall, door, key, etc...) to the specified status (on/off) (can be altered later)
    {
        "type": "changeStatus",
        "message0": "change %1 status to %2",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "OBJECT",
                "options": [
                    [
                        "robot",
                        "ROBOT"
                    ],
                    [
                        "wall",
                        "WALL"
                    ],
                    [
                        "door",
                        "DOOR"
                    ],
                    [
                        "key",
                        "KEY"
                    ],
                    [
                        "button",
                        "BUTTON"
                    ]
                ]
            },
            {
                "type": "field_dropdown",
                "name": "STATUS",
                "options": [
                    [
                        "on",
                        "ON"
                    ],
                    [
                        "off",
                        "OFF"
                    ]
                ]
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 60,
        "tooltip": "Changes the status of the specified object",
        "helpUrl": ""
    },
    //HERE ENDS ACTION BLOCKS (YELLOW SECTION FROM TOOLBOX)
    {
        "type": "start",
        "message0": "START",
        "nextStatement": null,
        "colour": 0,
        "tooltip": "Starts the game",
        "helpUrl": ""
    },
    //HERE ENDS BEGIN BLOCKS (PINK SECTION FROM TOOLBOX)
    {
        "type": "text",
        "message0": "%1",
        "args0": [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": " "
            }
        ],
        "colour": '#e13030',
        "output": "String",
        "tooltip": "Text block",
        "helpUrl": ""
    },
    //HERE ENDS TEXT BLOCKS (BRIGHT RED SECTION TOOLBOX)
    {
        "type": "number",
        "message0": "%1",
        "args0": [
            {
                "type": "field_number",
                "name": "NUMBER",
                "value": 0,
                "min": 0,
                "max": 30

            }
        ],
        "output": "Number",
        "colour": '#0d44ba',
        "tooltip": "Number block",
        "helpUrl": ""
    },
    //HERE ENDS NUMBER BLOCKS (BLUE SECTION TOOLBOX)
    {
        "type": "for_X_times",
        "message0": "during %1 times",
        "args0": [
            {
                "type": "input_value",
                "name": "TIMES",
                "check": "Number"
            }
        ],
        "message1": "do: %1",
        "args1": [
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#36e82a",
        "tooltip": "Repeats the enclosed steps a specific number of times.",
        "helpUrl": ""
    },
    {
        "type": "while_do",
        "message0": "while %1",
        "args0": [
            {
                "type": "input_value",
                "name": "CONDITION"
                //we will add "check" tag later to check it is ONLY a conditional block
            }
        ],
        "message1": "do: %1",
        "args1": [
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#36e82a",
        "tooltip": "Continuously perform a particular task while the condition is true.",
        "helpUrl": ""
    },
    //END OF LOOP CATEGORY (BRIGHT GREEN ON TOOLBOX)1
    {
        "type": "if_do",
        "message0": "if %1",
        "args0": [
            {
                "type": "input_value",
                "name": "CONDITION"
            }
        ],
        "message1": "do: %1",
        "args1": [
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#0b6b0c",
        "tooltip": "Perform a particular task if the condition is true.",
        "helpUrl": ""
    },
    {
        "type": "if_else_do",
        "message0": "if %1",
        "args0": [
            {
                "type": "input_value",
                "name": "CONDITION"
            }
        ],
        "message1": "do: %1",
        "args1": [
            {
                "type": "input_statement",
                "name": "DO"
            }
        ],
        "message2": "else: %1",
        "args2": [
            {
                "type": "input_statement",
                "name": "ELSE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#0b6b0c",
        "tooltip": "Perform a particular task if the condition is true, otherwise perform another task.",
        "helpUrl": ""
    },
    
    {
        "type": "comparator",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A"
            },
            {
                "type": "field_dropdown",
                "name": "COMPARATOR",
                "options": [
                    [">", ">"],
                    ["<", "<"],
                    ["=", "="]
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "output": "Boolean",
        "colour": "#0b6b0c",
        "tooltip": "Compares two values.",
        "helpUrl": ""
    },
    {
        "type": "and_or",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A"
            },
            {
                "type": "field_dropdown",
                "name": "COMPARATOR",
                "options": [
                    ["and", "and"],
                    ["or", "or"]
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "output": "Boolean",
        "colour": "#0b6b0c",
        "tooltip": "Performs a logical AND or OR operation on two inputs.",
        "helpUrl": ""
    }
]

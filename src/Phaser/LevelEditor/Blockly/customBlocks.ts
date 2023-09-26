//custom blocks definition in JSON format:

export default [
    {
        "type": "string_length",    // Block - ID
        "message0": 'length of %1', // Text on block

        // Input
        "args0": [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": "String"
            }
        ],

        // Output
        "output": "Number",
        "colour": 160,
        "tooltip": "Returns number of letters in the provided text.",
        "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
    },
    //create movement block, that takes a number and a direction (up down left right)
    {
        "type": "movement",
        "message0": "move %1 steps %2",
        "args0": [
            {
                "type": "field_number",
                "name": "STEPS",
                "value": 0,
                "min": 0
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
        "colour": 230,
        "tooltip": "Moves the robot in the specified direction",
        "helpUrl": ""
    },
    {
        "type": "start",
        "message0": "start executing",
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230,
        "tooltip": "Starts the game",
        "helpUrl": ""
    }
]
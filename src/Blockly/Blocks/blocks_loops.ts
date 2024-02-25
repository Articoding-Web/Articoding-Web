export default [
    // For X times Block
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
        "colour": "#5ba55b",
        "tooltip": "Repeats the enclosed steps a specific number of times.",
        "helpUrl": ""
    },
    // While do
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
        "colour": "#5ba55b",
        "tooltip": "Continuously perform a particular task while the condition is true.",
        "helpUrl": ""
    },
];
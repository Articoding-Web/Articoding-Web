export default [
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
        "colour": "#5b80a5",
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
        "colour": "#5b80a5",
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
                    ["=", "="],
                    ["!=", "!="],
                    [">", ">"],
                    [">=", ">="],
                    ["<=", "<="],
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "output": "Boolean",
        "colour": "#5b80a5",
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
        "colour": "#5b80a5",
        "tooltip": "Performs a logical AND or OR operation on two inputs.",
        "helpUrl": ""
    }
];
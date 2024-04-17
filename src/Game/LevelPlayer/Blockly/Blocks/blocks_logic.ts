export default [
  {
    type: "if_do",
    message0: "if %1",
    args0: [
      {
        type: "input_s",
        name: "CONDITION",
      },
    ],
    message1: "do: %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#5b80a5",
    tooltip: "Perform a particular task if the condition is true.",
    helpUrl: "",
  },
  {
    type: "if_else_do",
    message0: "if %1",
    args0: [
      {
        type: "input_value",
        name: "CONDITION",
      },
    ],
    message1: "do: %1",
    args1: [
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    message2: "else: %1",
    args2: [
      {
        type: "input_statement",
        name: "ELSE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#5b80a5",
    tooltip:
      "Perform a particular task if the condition is true, otherwise perform another task.",
    helpUrl: "",
  },
  {
    type: "comparator",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "A",
      },
      {
        type: "field_dropdown",
        name: "COMPARATOR",
        options: [
          ["=", "="],
          ["!=", "!="],
          [">", ">"],
          [">=", ">="],
          ["<=", "<="],
        ],
      },
      {
        type: "input_value",
        name: "B",
      },
    ],
    output: "Boolean",
    colour: "#5b80a5",
    tooltip: "Compares two values.",
    helpUrl: "",
  },
  {
    type: "and_or",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "A",
      },
      {
        type: "field_dropdown",
        name: "COMPARATOR",
        options: [
          ["and", "and"],
          ["or", "or"],
        ],
      },
      {
        type: "input_value",
        name: "B",
      },
    ],
    output: "Boolean",
    colour: "#5b80a5",
    tooltip: "Performs a logical AND or OR operation on two inputs.",
    helpUrl: "",
  },
  {
    type: "check_spikes_direction",
    message0: "check spikes in %1 are %2",
    args0: [
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["up", "up"],
          ["down", "down"],
          ["left", "left"],
          ["right", "right"],
        ],
      },
      {
        type: "field_dropdown",
        name: "STATUS",
        options: [
          ["enabled", "enabled"],
          ["disabled", "disabled"],
        ],
      },
    ],
    output: "Boolean",
    colour: "#5b80a5",
    tooltip:
      "Checks if the spikes in a given direction are in a specific state.",
    helpUrl: "",
  },
  {
    type: "check_adjacent_direction",
    message0: "check if %1 is adjacent in %2",
    args0: [
      {
        type: "input_value",
        name: "ENTITY",
      },
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["up", "up"],
          ["down", "down"],
          ["left", "left"],
          ["right", "right"],
        ],
      },
    ],
    output: "Boolean",
    colour: "#5b80a5",
    tooltip: "Checks if a given entity is adjacent in a specific direction.",
    helpUrl: "",
  },
];

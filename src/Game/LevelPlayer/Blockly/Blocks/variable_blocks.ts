export default [
    {
        type: "variables_get_panda",
        message0: "%1",
        args0: [
            {
                type: "field_variable",
                name: "VAR",
                variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
                variableTypes: [
                    "Panda"
                ],
                defaultType: "Panda"
            }
        ],
        output: "Panda"
    },
    {
        type: "variables_set_panda",
        message0: "%{BKY_VARIABLES_SET}",
        args0: [
            {
                type: "field_variable",
                name: "VAR",
                variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
                variableTypes: [
                    "Panda"
                ],
                defaultType: "Panda"
            },
            {
                type: "input_value",
                name: "VALUE",
                check: "Panda"
            }
        ],
        previousStatement: null,
        nextStatement: null
    }
];

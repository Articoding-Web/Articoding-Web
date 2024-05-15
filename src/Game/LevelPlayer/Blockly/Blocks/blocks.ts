//custom blocks definition in JSON format:
import action_blocks from "./blocks_action";
import loop_blocks from "./blocks_loops";
import logic_blocks from "./blocks_logic"
import variable_blocks from "./variable_blocks"

export default [
    {
        "type": "start",
        "message0": "START",
        "nextStatement": null,
        "colour": 0,
        "tooltip": "Starts the game",
        "helpUrl": ""
    },
    ...action_blocks,
    ...loop_blocks,
    ...logic_blocks,
    ...variable_blocks,
];
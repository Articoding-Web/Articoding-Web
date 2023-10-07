import { javascriptGenerator } from "blockly/javascript";
//Here we define all block behaviour

export function defineBlocks() {
    //generic movement block (movement steps in parsed direction)
    javascriptGenerator.forBlock['movement'] = function (block, generator) {
        var number_steps = block.getFieldValue('STEPS');
        var dropdown_direction = block.getFieldValue('DIRECTION');
        // TODO: Assemble javascript into code variable.
        var code = 'move(' + number_steps + ', ' + dropdown_direction + ');\n';
        // TODO: Change ORDER_NONE to the correct strength.
        return code;
    };
    //Start Block, init call for phaserJS scene
    javascriptGenerator.forBlock['start'] = function (block, generator) {
        var code = 'start();\n';
        return code;
    }
    //pending blocks recently implemented: TODO
    //TODO
}
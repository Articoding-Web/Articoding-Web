import { javascriptGenerator } from "blockly/javascript";
//Here we define all block behaviour

//Here we define all block behaviour
export function defineAllBlocks() {
    //Some functions don't need generator, but others will, so it's been left on purpose.
    //generic movement block (movement steps in parsed direction)
    javascriptGenerator.forBlock['movement'] = function (block, generator) {
        var number_steps = block.getFieldValue('STEPS');
        var dropdown_direction = block.getFieldValue('DIRECTION');
        // TODO: Assemble javascript into code variable.
        var code = 'move(' + number_steps + ', ' + dropdown_direction + ');';
        return code;
    };
    //Start Block, init call for phaserJS scene
    javascriptGenerator.forBlock['start'] = function (block, generator) {
        var code = 'start();';
        return code;
    }
    //rotate block, action toolbox
    javascriptGenerator.forBlock['rotate'] = function (block, generator) {
        var dropdown_direction = block.getFieldValue('DIRECTION');
        var times = block.getFieldValue('TIMES');
        var code = 'rotate(' + dropdown_direction + ', ' + times + ');';
        return code;
    }
    //changeStatus block, changes the status of the specified object
    javascriptGenerator.forBlock['changeStatus'] = function (block, generator) {
        var dropdown_entity = block.getFieldValue('ENTITY');
        var value_id = generator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC); //TODO PENDING TEST
        var dropdown_status = block.getFieldValue('STATUS');//ON/OFF
        var code = 'changeStatus(' + dropdown_entity + ', ' + value_id + ', ' + dropdown_status + ');\n';
        return code;
    }
    //Text block
    javascriptGenerator.forBlock['text'] = function (block, generator) {
        var text = block.getFieldValue('TEXT');
        var code = '"' + text + '"'; 
        return code; //TODO order atomic check
    }
    //Number block
    javascriptGenerator.forBlock['number'] = function (block, generator) {
        var number = block.getFieldValue('NUMBER');
        var code = number.toString();
        return code;
    }
    //For X times block
    javascriptGenerator.forBlock['for_X_times'] = function (block, generator) {
        var times = block.getFieldValue('TIMES');
        var doCode = generator.statementToCode(block, 'DO');//TODO eval=???
        var code = 'forBlock(' + times + ', ' + doCode + ');';//TODO check
        return code;
    }
    //While do block
    javascriptGenerator.forBlock['while_do'] = function (block, generator) {
        var condition = generator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        var doCode = generator.statementToCode(block, 'DO');
        var code = 'whileBlock (' + condition + ',' + ');'; //TODO check loop
        return code;
    }
}

import { javascriptGenerator } from "blockly/javascript";
//Here we define all block behaviour

//Here we define all block behaviour
export function defineAllBlocks() {
    //Some functions don't need generator, but others will, so it's been left on purpose.
    //generic movement block (movement steps in parsed direction)
    javascriptGenerator.forBlock['movement'] = function (block:any, generator:any) {
        let innerCode = generator.statementToCode(block, 'STEPS');
        let dropdown_direction = block.getFieldValue('DIRECTION');
        let code = 'this.move('+innerCode +',"' + dropdown_direction +'");';
        return code;
    };

    //Start Block, init call for phaserJS scene
    javascriptGenerator.forBlock['start'] = function (block, generator) {
        let code = '';
        return code;
    }

    //rotate block, action toolbox
    javascriptGenerator.forBlock['rotate'] = function (block, generator) {
        let dropdown_direction = block.getFieldValue('DIRECTION');
        let times  = generator.statementToCode(block, 'TIMES');
        let code = 'this.rotate('+ dropdown_direction + ',' + times + ');';
        return code;
    }
    //changeStatus block, changes the status of the specified object
    javascriptGenerator.forBlock['changeStatus'] = function (block, generator) {
        let dropdown_entity = block.getFieldValue('ENTITY');
        let value_id = generator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC); //TODO PENDING TEST
        let dropdown_status = block.getFieldValue('STATUS');//ON/OFF
        let code = 'changeStatus(' + dropdown_entity + ', ' + value_id + ', ' + dropdown_status + ');\n';
        return code;
    }

    //Text block
    javascriptGenerator.forBlock['text'] = function (block, generator) {
        let text = block.getFieldValue('TEXT');
        let code = '"' + text + '"'; 
        return code; //TODO order atomic check
    }

    //Number block
    javascriptGenerator.forBlock['numberSpecial'] = function (block, generator) {
        let number = block.getFieldValue('NUMBER');
        let code = number.toString();
        return code;
    }

    //For X times block
    javascriptGenerator.forBlock['for_X_times'] = function (block, generator) {
        let times = block.getFieldValue('TIMES');
        let doCode = generator.statementToCode(block, 'DO');//TODO eval=???
        let code = 'forBlock(' + times + ', ' + doCode + ');';//TODO check
        return code;
    }

    //While do block
    javascriptGenerator.forBlock['while_do'] = function (block, generator) {
        let condition = generator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        let doCode = generator.statementToCode(block, 'DO');
        let code = 'whileBlock (' + condition + ',' + ');'; //TODO check loop
        return code;
    }
}

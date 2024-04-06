import type { Block } from 'blockly/core/block';
import {
  javascriptGenerator,
  Order,
} from 'blockly/javascript';

//Here we define all block behaviour

//Here we define all block behaviour
export function defineAllBlocks() {
  let variables: Record<string, string | number> = {}; // variable[name] = value;

  //Some functions don't need generator, but others will, so it's been left innerCoderpose.
  //generic movement block (movement steps in parsed direction)
  javascriptGenerator.forBlock["movement"] = function (
    block: Block,
    generator: any
  ) {
    let repeats;
    if (block.getField("TIMES")) {
      // Internal number.
      repeats = String(Number(block.getFieldValue("TIMES")));
    } else {
      // External number.
      repeats = generator.valueToCode(block, "TIMES", Order.ASSIGNMENT) || "0";
    }
    let dropdown_direction = block.getFieldValue("DIRECTION");
    let code = {
      blockId: block.id,
      eventName: "move",
      data: {
        direction: dropdown_direction,
      },
      times: repeats
    };
    return JSON.stringify(code);
  };

  //Start Block, init call for phaserJS scene
  javascriptGenerator.forBlock["start"] = function (
    block: Block,
    generator: any
  ) {
    let code = "";
    return code;
  };

  //rotate block, action toolbox
  javascriptGenerator.forBlock["rotate"] = function (
    block: Block,
    generator: any
  ) {
    let dropdown_direction = block.getFieldValue("DIRECTION");
    if (dropdown_direction === "CLOCKWISE") dropdown_direction = "RIGHT";
    else dropdown_direction = "LEFT";

    let code = 'this.rotate("' + dropdown_direction + '");';
    return code;
  };

  //changeStatus block, changes the status of the specified object
  javascriptGenerator.forBlock["changeStatus"] = function (
    block: Block,
    generator: any
  ) {
    let dropdown_status = block.getFieldValue("STATUS"); //ON/OFF
    let code = {
      blockId: block.id,
      eventName: "change_status",
      data: {
        status: dropdown_status,
      },
    };
    return JSON.stringify(code);
  };

  //number block:
  javascriptGenerator.forBlock["math_block"] = function (block: Block, generator: any): [string, Order] {
    // Numeric value.
    const number = Number(block.getFieldValue('NUM'));
    const order = number >= 0 ? Order.ATOMIC : Order.UNARY_NEGATION;
    return [String(number), order];
  }

  //Text block
  javascriptGenerator.forBlock["textSpecial"] = function (
    block: Block,
    generator: any
  ) {
    let text = block.getFieldValue("TEXT");
    let code = '"' + text + '"';
    return code; //TODO order atomic check
  };

  //For_X_times block
  javascriptGenerator.forBlock["for_X_times"] = function (
    block: any,
    generator: any
  ) {
    let children = block.getChildren(true);
    // Repeat n times.
    let repeats;

    repeats = generator.valueToCode(block, "TIMES", Order.ASSIGNMENT) || "0";
    let childBlock;
    if (children.length === 1 && children[0].type != "math_number")
      childBlock = children[0];
    else if (children.length > 1) {
      childBlock = children[1]
    }

    let childBlockCode = [];

    while (childBlock) {
      const blockCode = generator.blockToCode(childBlock, true);
      childBlockCode.push(blockCode);
      childBlock = childBlock.getNextBlock();
    }
    if (repeats >= 25 || childBlockCode.length >= 25) {
      console.log("You are trying to repeat too many times, this may cause performance issues.");
      repeats = childBlockCode.length * 15;
    }
    let events = `[`;
    for (let x = 0; x < repeats; x++) {
      for (let y = 0; y < childBlockCode.length; y++) {
        events += childBlockCode[y];
        if (y < childBlockCode.length - 1)
          events += ","
      }
      if (x < repeats - 1)
        events += ","
    }
    events += "]"
    return events;
  };

  javascriptGenerator.forBlock["if_do"] = function (
    block: Block,
    generator: any
  ) {
    let condition = generator.valueToCode(block, "CONDITION", Order.NONE);
    let children = block.getChildren(true);
    let childBlock;
    if (children.length === 1 && children[0].type != "math_number")
      childBlock = children[0];
    else if (children.length > 1) {
      childBlock = children[1]
    }
    let childBlockCode = [];
    while (childBlock) {
      const blockCode = generator.blockToCode(childBlock, true);
      childBlockCode.push(blockCode);
      childBlock = childBlock.getNextBlock();
    }

    // Create the event code.
    let events = `[`;
    for (let y = 0; y < childBlockCode.length; y++) {
      events += childBlockCode[y];
      if (y < childBlockCode.length - 1)
        events += ","
    }
    events += "]"

    // Conditions WILL be evaluated in their block function, otherwise this gets out of hand real f***ing fast
    let code = {
      blockId: block.id,
      eventName: "if_do",
      data: {
        condition: condition,
        events: events
      }
    };

    return JSON.stringify(code);
  };
  //set block, sets the value of a variable with a block input
  javascriptGenerator.forBlock["set"] = function (block: Block, generator: any) {
    let variableName = block.getFieldValue("VAR_NAME");
    let value = generator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "0";
    let code = {
      blockId: block.id,
      eventName: "set_var",
      data: {
        variableName: variableName,
        value: value,
      },
    };
    return JSON.stringify(code);
  };

  // Variable blocks
  javascriptGenerator.forBlock["variables_set"] = function (block: Block, generator: any) {
    // Variable setter.
    const argument0 = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
    const varName = block.getFieldValue('VAR');
    variables[varName] = argument0;
    return [];
  };

  javascriptGenerator.forBlock["variables_get"] = function (block: Block, generator: any) {
    // Variable getter.
    const varName = block.getFieldValue('VAR');
    return [variables[varName], Order.ATOMIC];
  };
}

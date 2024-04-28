import * as Blockly from "blockly";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { javascriptGenerator } from "blockly/javascript";
import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import { BlockCode } from "./types/BlockCode";
import {ObservableProcedureModel} from '@blockly/block-shareable-procedures';
import {
  ObservableParameterModel,
  isProcedureBlock
} from '@blockly/block-shareable-procedures';

import * as block_code from "./javascript/block_code";
import blocks from "./Blocks/blocks";

import config from "../../config";
import { restartCurrentLevel } from "../../../SPA/loaders/levelPlayerLoader";
import { Block } from "blockly";
import Level from "../../level";

// TODO: Eliminar numero magico
const BLOCK_OFFSET = 50;

export default class BlocklyController {
  private static startBlock: Blockly.BlockSvg;
  private static workspace: Blockly.WorkspaceSvg;
  private static code: BlockCode[];
  private static isRunningCode: boolean = false;
  private static shouldAbort: boolean = false;
  private static changeData: any;
  private static runCodeBtn: HTMLElement;
  private static blocklyEvents = [
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
  ];

  static init(container: string | Element, toolbox?: string | ToolboxDefinition | Element, maxInstances?: Level.MaxInstances, workspaceBlocks?: Level.WorkspaceBlock[]) {
    this.createWorkspace(container, toolbox, maxInstances, workspaceBlocks);

    // onclick en vez de addEventListener porque las escenas no se cierran bien y el event listener no se elimina...
    BlocklyController.runCodeBtn = <HTMLElement>document.getElementById("runCodeBtn");
    // runCodeBtn.onclick = (ev: MouseEvent) => this.runCode();
    BlocklyController.runCodeBtn.addEventListener("click", this.runCode);

    // onclick en vez de addEventListener porque las escenas no se cierran bien y el event listener no se elimina...
    let stopCodeBtn = <HTMLElement>document.getElementById("stopCodeBtn");
    stopCodeBtn.onclick = (ev: MouseEvent) => this.abortAndReset();
  }

  private static createWorkspace(container: string | Element, toolbox?: string | ToolboxDefinition | Element, maxInstances?: Level.MaxInstances, workspaceBlocks?: Level.WorkspaceBlock[]) {
    BlocklyController.workspace = Blockly.inject(container, { toolbox, maxInstances, zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2, pinch: true, }, });

    // Initialize plugin.
    const zoomToFit = new ZoomToFitControl(this.workspace);
    zoomToFit.init();

    const blocklyArea = document.getElementById("blocklyArea");
    const blocklyDiv = document.getElementById("blocklyDiv");
    const onresize = () => {
      blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
      blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
      Blockly.svgResize(this.workspace);
    };

    window.addEventListener("resize", onresize, false);
    onresize();

    Blockly.defineBlocksWithJsonArray(blocks);
    Blockly.Blocks['my_procedure_def'] = {
      init: function() {
        //pending
        this.model = new ObservableProcedureModel(this.workspace,'default name');
        this.workspace.getProcedureMap().add(this.model);

      },
      destroy: function() {
        this.workspace.getProcedureMap().delete(this.model.getId());
      },
      doProcedureUpdate() {
        this.setFieldValue('NAME', this.model.getName());
        this.setFieldValue(
            'PARAMS',
            this.model.getParameters()
                .map((p) => p.getName())
                .join(','));
        this.setFieldValue(
            'RETURN', this.model.getReturnTypes().join(','));
      },
      getProcedureModel() {
        return this.model;
      },
    
      isProcedureDef() {
        return true;
      },
    
      getVarModels() {
        return [];
      },
      saveExtraState() {
        return {
          'procedureId': this.model.getId(),
    
          // These properties are only necessary for pasting.
          'name': this.model.getName(),
          'parameters': this.model.getParameters().map((p) => {
            return {name: p.getName(), id: p.getId()};
          }),
          'returnTypes': this.model.getReturnTypes(),
        };
      },
      loadExtraState(state) {
        const id = state['procedureId']
        const map = this.workspace.getProcedureMap();
    
        // Grab a reference to the existing procedure model.
        if (this.model.getId() != id && map.has(id) &&
            (this.isInsertionMarker || this.noBlockHasClaimedModel_(id))) {
          // Delete the existing model (created in init).
          this.workspace.getProcedureMap().delete(this.model.getId());
          // Grab a reference to the new model.
          this.model = this.workspace.getProcedureMap()
              .get(state['procedureId']);
          this.doProcedureUpdate();
          return;
        }
    
        // There is no existing procedure model (we are likely pasting), so
        // generate it from JSON.
        this.model
            .setName(state['name'])
            .setReturnTypes(state['returnTypes']);
        for (const [i, param] of state['parameters'].entries()) {
          this.model.insertParameter(
              i,
              new ObservableParameterModel(
                  this.workspace, param['name'], param['id']));
        }
      },
      noBlockHasClaimedModel_(procedureId) {
        const model =
          this.workspace.getProcedureMap().get(procedureId);
        return this.workspace.getAllBlocks(false).every(
          (block) =>
            !isProcedureBlock(block) ||
            !block.isProcedureDef() ||
            block.getProcedureModel() !== model);
      }
    };


    Blockly.Blocks['my_procedure_call'] = {
      doProcedureUpdate() {
        this.setFieldValue('NAME', this.model.getName());
        this.setFieldValue(
            'PARAMS',
            this.model.getParameters()
                .map((p) => p.getName())
                .join(','));
        this.setFieldValue(
            'RETURN', this.model.getReturnTypes().join(','));
      },
      getProcedureModel() {
        return this.model;
      },
    
      isProcedureDef() {
        return false;
      },
    
      getVarModels() {
        // If your procedure references variables
        // then you should return those models here.
        return [];
      },
      saveExtraState() {
        return {
          'procedureId': this.model.getId(),
        };
      },
    
      loadExtraState(state) {
        // Delete our existing model (created in init).
        this.workspace.getProcedureMap().delete(this.model.getId());
        // Grab a reference to the new model.
        this.model = this.workspace.getProcedureMap()
            .get(state['procedureId']);
        if (this.model) this.doProcedureUpdate();
      },
    
      // Handle pasting after the procedure definition has been deleted.
      onchange(event) {
        if (event.type === Blockly.Events.BLOCK_CREATE &&
            event.blockId === this.id) {
          if(!this.model) { // Our procedure definition doesn't exist =(
            this.dispose();
          }
        }
      }
    };
    const proceduresFlyoutCallback = function(workspace) {
      const blockList = [];
      blockList.push({
        'kind': 'block',
        'type': 'my_procedure_def',
      });
      for (const model of
            workspace.getProcedureMap().getProcedures()) {
        blockList.push({
          'kind': 'block',
          'type': 'my_procedure_call',
          'extraState': {
            'procedureId': model.getId(),
          },
        });
      }
      return blockList;
    };
    
    this.workspace.registerToolboxCategoryCallback(
        'MY_PROCEDURES', proceduresFlyoutCallback);
        //i mtesting this (do not touch yet)
    this.startBlock = this.workspace.newBlock("start");
    this.startBlock.initSvg();
    this.startBlock.render();
    this.startBlock.setDeletable(false);
    this.startBlock.moveBy(BLOCK_OFFSET, BLOCK_OFFSET);
    let offset = BLOCK_OFFSET;
    for (let workspaceBlock of workspaceBlocks) {
      offset += BLOCK_OFFSET;

      // Create block
      const block = this.workspace.newBlock(workspaceBlock.id);
      block.initSvg();
      block.render();
      block.moveBy(BLOCK_OFFSET, offset);

      // Process block options
      if (workspaceBlock.opts?.isDeletable !== undefined)
        block.setDeletable(workspaceBlock.opts.isDeletable);
    }

    javascriptGenerator.init(this.workspace);
    block_code.defineAllBlocks();

    this.workspace.addChangeListener((event) => {
      if (event.type === "block_field_intermediate_change") {
        this.changeData = event;
      }
      if (this.workspace.isDragging()) return; // Don't update while changes are happening.
      if (!this.blocklyEvents.includes(event.type)) return;

      this.code = this.generateCode();
    });
  }

  static highlightBlock(id: string | null) {
    if (this.workspace)
      this.workspace.highlightBlock(id);
  }

  private static generateCode(): BlockCode[] {
    let nextBlock = this.startBlock.getNextBlock();
    let code = [];
    while (nextBlock) {

        const blockCode = JSON.parse(javascriptGenerator.blockToCode(nextBlock, true));
        if (Array.isArray(blockCode)) {
          for (let innerBlockCode of blockCode)
            code.push(<BlockCode>innerBlockCode);
        } else code.push(<BlockCode>blockCode);
      nextBlock = nextBlock.getNextBlock();
    }
    return code;
  }

  private static runCode = (e: MouseEvent) => {
    e.stopPropagation();
    //this.workspace.getAllBlocks(true)[0].select();
      let prepBlocks = this.workspace.getAllBlocks(true);
      for (let block of prepBlocks) {
        if (this.changeData) {
          this.workspace.getBlockById(this.changeData.blockId).setFieldValue(this.changeData.newValue, this.changeData.name);
          this.changeData = null;
          this.code = this.generateCode();
        }
      }
      if (this.shouldAbort) {
        this.highlightBlock(null);
        this.isRunningCode = false; // Reset flag
        this.shouldAbort = false; // Reset flag
      } else if (BlocklyController.isRunningCode)
        return;

      let index = 0;
      const executeNextBlock = () => {
        if (this.shouldAbort) {
          this.highlightBlock(null);
          this.isRunningCode = false; // Reset flag
          this.shouldAbort = false; // Reset flag
          return; // Abort execution
        }

        if (index < this.code.length) {
          BlocklyController.isRunningCode = true;
          let code = this.code[index];
          console.log("running code", code);
          this.highlightBlock(code.blockId);

          let times = 0;
          const emitEvent = (eventName: string, eventData) => {
            if (this.shouldAbort) {
              this.highlightBlock(null);
              this.isRunningCode = false; // Reset flag
              this.shouldAbort = false; // Reset flag
              return; // Abort execution
            }

          if (times < (code.times || 1)) {
            const event = new CustomEvent(eventName, { detail: eventData });
            document.dispatchEvent(event);
            times++;

            const speedModifier = parseInt((document.getElementById("speedModifierBtn") as HTMLInputElement).value);

            setTimeout(emitEvent, config.MOVEMENT_ANIMDURATION / speedModifier * 1.5, eventName, eventData);  // TODO: ver como esperar a que acabe la acción
          } else {
            index++;
            executeNextBlock();
          }
        };
        emitEvent(code.eventName, code.data);
      } else {
        BlocklyController.isRunningCode = false;
        // Finished code execution
        this.highlightBlock(null);
        const event = new CustomEvent("execution-finished");
        document.dispatchEvent(event);
      }
    };
    executeNextBlock();
  }
  
  private static abortAndReset() {
    this.shouldAbort = true;
    restartCurrentLevel();
  }

  static destroyWorkspace() {
    if (BlocklyController.workspace) {
      BlocklyController.shouldAbort = true;
      BlocklyController.runCodeBtn.removeEventListener("click", this.runCode);
      window.removeEventListener("resize", onresize, false);
      BlocklyController.workspace.dispose();
      BlocklyController.workspace = undefined;
    }
  }
}

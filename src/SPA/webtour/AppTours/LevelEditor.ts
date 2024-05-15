import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep";

export default function LevelEditor(): TourGuideStep[] {
    return [
        {
            "title": "Welcome to BlockLeap!",
            "content": "This is the Level Editor, where you can create your own Froggy adventures! 🐸",
            "order": 1,
            "group": "LevelEditor"
        },
        {
            "content": "This is the Blockly work area, where you'll do the actual programming. You can move around by dragging.",
            "target": ".blocklyMainBackground",
            "order": 2,
            "group": "LevelPlayer"
        },
        {
            "content": "You can automatically zoom to fit all blocks by clicking here, or the buttons below for more specific control.",
            "target": ".zoomToFit",
            "order": 3,
            "group": "LevelPlayer"
        },
        {
            "content": "This is the start block",
            "target": '.blocklyDraggable[data-id="start"]',
            "order": 4,
            "group": "LevelPlayer"
        },
        {
            "content": "This is the Run Code button. Clicking it will start your code.",
            "target": "#runCodeBtn",
            "order": 5,
            "group": "LevelPlayer"
        },
        {
            "content": "When you click Run Code, Froggy will follow your instructions and try to reach the exit.",
            "target": "#phaserDiv",
            "order": 6,
            "group": "LevelPlayer"
        },
        {
            "content": "This is the Stop button, it will stop your code and reset the level.",
            "target": "#stopCodeBtn",
            "order": 7,
            "group": "LevelPlayer"
        },
        {
            "content": "This is the Speed button, it will make the code run faster and animations will take less time.",
            "target": "#speedModifierBtn",
            "order": 8,
            "group": "LevelPlayer"
        },
        {
            "content": "This is the Tour button, if you need to repeat this tour click me!",
            "target": "#levelPlayerTourBtn",
            "order": 9,
            "group": "LevelPlayer"
        }
    ];
}
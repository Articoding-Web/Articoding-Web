import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep";

export default function MovementBlockTour(): TourGuideStep[] {
    return [{
        "title": "Movement Blocks",
        "content": "This is Movement Block. You can place a Number Block inside it.",
        "target": '.blocklyDraggable[data-id="movement"]',
        "order": 1,
        "group": "MovementBlock"
    },
    {
        "content": "This is Movement Block. You can place a Number Block inside it.",
        "target": '.blocklyDraggable[data-id="movement"] .blocklyEditableText',
        "order": 2,
        "group": "MovementBlock"
    }]
}
import "@sjmc11/tourguidejs/src/scss/tour.scss" // Styles
import { TourGuideClient } from "@sjmc11/tourguidejs/src/Tour" // JS 
import { TourGuideStep } from "@sjmc11/tourguidejs/src/types/TourGuideStep";
import BlockTours from "./BlockTours/BlockTours";
import AppTours from "./AppTours/AppTours";

export default class TourController {
    static tg: TourGuideClient;
    private static allTours: (() => TourGuideStep[])[] = [
        ...AppTours,
        ...BlockTours
    ]

    static async init() {
        TourController.tg = new TourGuideClient( {
            completeOnFinish: true,     // Set tour as finished in localStorage on finish | default = true
            keyboardControls: true,     // show next & prev arrows keys + esc key | default =false
            exitOnClickOutside: false, // Close the tour on backdrop click | default = true
            rememberStep: false, // open tour on last active step | default = true
            debug: false, // show console logging | default = false
            steps: TourController.getAllTours()
        });
    }

    static async start(group: string) {
        TourController.tg.start(group);
    }

    static async startIfNotFinished(group: string) {
        if(!TourController.tg.isFinished(group))
            TourController.start(group);
    }

    private static getAllTours(): TourGuideStep[] {
        // Combined array to store aggregated results
        const combinedSteps: TourGuideStep[] = [];

        // Iterate over each tour function, call it, and concatenate its results
        for (const tourFunction of TourController.allTours) {
            combinedSteps.push(...tourFunction());
        }

        return combinedSteps;
    }
}
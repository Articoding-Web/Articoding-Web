var localStorage: Storage;

interface Level {
    id: number;
    stars: number;
    attempts: number;
    playable: boolean;
}

interface Play {
    level: number;
    stars: number;
    attempts: number;
    playable: boolean;
}

const localUtils = {
    async init() {
        localStorage = window.localStorage;
        console.log("Initialized");
    },

    async setHighestCategory(id: number | string) {
        localStorage.setItem("HIGHEST_CAT", `${id}`);
    },

    getHighestCategory(): number | null {
        const stored = localStorage.getItem("HIGHEST_CAT");
        if (stored) return parseInt(stored);
        return null;
    },

    async setLevel(catId: number | string, level: Level) {
        localStorage.setItem(`CAT_${catId}_LEVEL_${level.id}`, JSON.stringify(level));
    },

    getLevel(catId: number | string, levelId: number): Level | null {
        const stored = localStorage.getItem(`CAT_${catId}_LEVEL_${levelId}`);
        if (stored) return JSON.parse(stored);
        return null;
    }
};

export default localUtils;
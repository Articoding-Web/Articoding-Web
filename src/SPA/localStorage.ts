var localStorage: Storage;

interface Category {
    id: number;
}

interface Level {
    id: number;
    category: number;
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

    async setCategory(category: string, value: Category) {
        localStorage.setItem(category, JSON.stringify(value));
    },

    async getCategory(key: string): Promise<Play[] | null> {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        return null;
    },

    async setLevel(level: string, value: Level) {
        localStorage.setItem(level, JSON.stringify(value));
    },

    async getLevel(key: string): Promise<Level[] | null> {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        return null;
    },
    
    async setPlay(key: string, value: Play[]) {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    },
    
    async getPlay(key: string): Promise<Play[] | null> {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue) return JSON.parse(serializedValue);
        return null;
    },

    async getAllCategories(): Promise<Category[]> {
        const categories: Category[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log("Key:", key); // Debug statement
            if (key && !isNaN(parseInt(key))) { // Check if the key is a number
                const category = this.getCategory(key);
                categories.push(category);
            }
        }
        console.log("All Categories:", categories); // Debug statement
        return categories;
    }

};

export default localUtils;
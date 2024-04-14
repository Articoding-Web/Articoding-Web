var localStorage: Storage;

interface Play {
    user: number;
    level: number;
    stars: number;
    attempts: number;
    category: number;
}

const localUtils = {
    async init() {
        localStorage = window.localStorage;
    },
    
    async setPlay(key: string, value: Play[]) {
        // Convert the value array to a string before storing
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    },
    
    async getPlay(key: string): Promise<Play[] | null> {
        // Retrieve the stored string value from localStorage
        const serializedValue = localStorage.getItem(key);
    
        if (serializedValue) {
            // If a value is found, parse it back into an array of Play objects
            const parsedValue = JSON.parse(serializedValue);
            return parsedValue;
        } else {
            // If no value is found for the specified key, return null
            return null;
        }
    },
    
    async getAllPlaysForCategory(category: string): Promise<Play[]> {
        const keys = Object.keys(localStorage);
        const playsForCategory: Play[] = [];
    
        for (const key of keys) {
            const value = await this.getPlay(key);
            if (value) {
                const levelsInCategory = value.filter(play => play.category === category);
                playsForCategory.push(...levelsInCategory);
            }
        }
    
        return playsForCategory;
    },
    
    async hasPassedCategory(category: string, threshold: number): Promise<boolean> {
        const playsForCategory = await this.getAllPlaysForCategory(category);
        // check if all levels in the category have been passed
        return playsForCategory.every(play => play.stars >= threshold);
    }
};

export default localUtils;
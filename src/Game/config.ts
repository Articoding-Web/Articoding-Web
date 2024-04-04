require('dotenv').config();
const config = {
    TILE_SIZE: 16,  // in pixels
    MOVEMENT_ANIMDURATION: 900, // in milliseconds
    API_ENDPOINT : `http://${process.env.API_SERVER_URL}:${process.env.API_PORT}/api`,
    EDITOR_MIN_ROWS: 3,
    EDITOR_MIN_COLS: 3,
    EDITOR_MAX_ROWS: 8,
    EDITOR_MAX_COLS: 8,
}

export default config;
const db = require('../db');

async function getRecommendedPosts(req, db) {
    try {
        const sql = `
            SELECT id_post 
            FROM posts 
            ORDER BY (RANDOM() * id_post) DESC 
            LIMIT 20
        `;
        
        const result = await db.query(sql);
        return result.rows.map(row => row.id_post);

    } catch (error) {
        console.error("Error fetching recommended posts:", error);
        throw error; 
    }
}

module.exports = {
    getRecommendedPosts
}
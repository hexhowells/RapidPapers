import axios from 'axios';

export const bookmark = async (itemId) => {
    try {
        await axios.post('/addpaper', { paper_id: itemId, status: 'to read' });
    } catch (error) {
        console.error(error);
        throw error; // or return some error data
    }
};

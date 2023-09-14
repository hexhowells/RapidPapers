import axios from 'axios';

export const bookmark = async (itemId, isBookmarked) => {
    var api_url = isBookmarked ? '/removepaper' : '/addpaper';
    try {
        await axios.post(api_url, { paper_id: itemId, status: 'to read' });
    } catch (error) {
        console.error(error);
        throw error; // or return some error data
    }
};

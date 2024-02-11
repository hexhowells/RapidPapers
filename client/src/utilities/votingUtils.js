import axios from 'axios';

export const fetchUserVote = async (itemId) => {
    try {
        const res = await axios.get(`/api/v1/uservote?paper_id=${itemId}`);
        return res.data.user_vote;
    } catch (error) {
        console.error(error);
        throw error; // or return some error data
    }
};

export const upvote = async (itemId) => {
    try {
        const res = await axios.post('/api/v1/upvote', { paper_id: itemId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error; // or return some error data
    }
};

export const downvote = async (itemId) => {
    try {
        const res = await axios.post('/api/v1/downvote', { paper_id: itemId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error; // or return some error data
    }
};

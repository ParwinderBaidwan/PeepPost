
async function sendMessage(req, res){
    try {
        const {recipientId, message} = req.body;
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

export {sendMessage}
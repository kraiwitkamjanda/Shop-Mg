const express = require('express');
const router = express.Router();

router.post('/line', (req, res) => {
    const events = req.body.events;
    events.forEach(event => {
        if (event.type === 'message') {
            // Logic: If user sends "Points", reply with their current point balance
            // fetched from the Customer model via lineUserId.
            console.log('Message from:', event.source.userId);
        }
    });
    res.sendStatus(200);
});

module.exports = router;
const webpush = require('web-push');
const constants = require('./constants');

module.exports = function(app)
{
    // check web-push documetation for more detail
    webpush.setVapidDetails("mailto:contact@localhost.com",constants.vapid_public_key,constants.vapid_private_key);

    app.use((req,res,next) => {

        req.webpush = webpush;
        next();
    })
}
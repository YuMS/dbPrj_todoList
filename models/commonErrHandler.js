/**
 * Author: YuMS
 */

module.exports = function(req, res, err, transfer, url) {
    transfer = transfer || {user: req.user, message: err};
    url = url || 'error';
    if (err) {
        res.render(url, transfer);
        return true;
    }
    return false;
}

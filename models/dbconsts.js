/**
 * Author: YuMS
 */

var settings = require('../settings');
require('date-utils');
var consts = {
    list: function() {
        var q = 'SELECT * from ' + settings.DATABASE + '.' + settings.TODOTABLE + ' order by tid desc';
        console.log('listing', q);
        return q;
    },
    insert: function(data) {
        var d = new Date();
        d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
        var q = 'INSERT INTO ' + settings.DATABASE + '.' + settings.TODOTABLE + '(`data`, `date`, `done`) VALUES(\'' + data + '\',\'' + d.toFormat('YYYY-MM-DD HH24:MI:SS') + '\',\'0\')';
        console.log('inserting', q);
        return q;
    },
    del: function(line) {
        var q = 'DELETE FROM ' + settings.DATABASE + '.' + settings.TODOTABLE + ' WHERE `tid`=\'' + line + '\'';
        console.log('deleting' + q);
        return q;
    },
    toggleon: function(line) {
        var q = 'UPDATE ' + settings.DATABASE + '.' + settings.TODOTABLE + ' SET `done`=\'1\' WHERE `tid`=\'' + line + '\'';
        console.log('toggling on', q);
        return q;
    },
    toggleoff: function(line) {
        var q = 'UPDATE ' + settings.DATABASE + '.' + settings.TODOTABLE + ' SET `done`=\'0\' WHERE `tid`=\'' + line + '\'';
        console.log('toggling of', q);
        return q;
    }
}
module.exports = consts;

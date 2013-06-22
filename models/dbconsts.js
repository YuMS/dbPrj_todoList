/**
 * Created with JetBrains WebStorm.
 * User: YuMS
 * Date: 13-2-26
 * Time: 下午9:24
 * To change this template use File | Settings | File Templates.
 */

var settings = require('../settings');
require('date-utils');
var consts = {
    list: function() {
        console.log('listing ' + 'SELECT * from ' + settings.DATABASE + '.' + settings.TABLE + ' order by id desc');
        return 'SELECT * from ' + settings.DATABASE + '.' + settings.TABLE + ' order by id desc';
    },
    insert: function(data) {
        var d = new Date();
        d = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
        console.log('inserting ' + 'INSERT INTO ' + settings.DATABASE + '.' + settings.TABLE + '(`data`, `date`, `done`) VALUES(\'' + data + '\',\'' + d.toFormat('YYYY-MM-DD HH24:MI:SS') + '\',\'0\')');
        return 'INSERT INTO ' + settings.DATABASE + '.' + settings.TABLE + '(`data`, `date`, `done`) VALUES(\'' + data + '\',\'' + d.toFormat('YYYY-MM-DD HH24:MI:SS') + '\',\'0\')';
    },
    del: function(line) {
        console.log('deleting ' + 'DELETE FROM ' + settings.DATABASE + '.' + settings.TABLE + ' WHERE `id`=\'' + line + '\'');
        return 'DELETE FROM ' + settings.DATABASE + '.' + settings.TABLE + ' WHERE `id`=\'' + line + '\'';
    },
    toggleon: function(line) {
        console.log('toggling on ' + 'UPDATE ' + settings.DATABASE + '.' + settings.TABLE + ' SET `done`=\'1\' WHERE `id`=\'' + line + '\'');
        return 'UPDATE ' + settings.DATABASE + '.' + settings.TABLE + ' SET `done`=\'1\' WHERE `id`=\'' + line + '\'';
    },
    toggleoff: function(line) {
        console.log('toggling off ' + 'UPDATE ' + settings.DATABASE + '.' + settings.TABLE + ' SET `done`=\'0\' WHERE `id`=\'' + line + '\'');
        return 'UPDATE ' + settings.DATABASE + '.' + settings.TABLE + ' SET `done`=\'0\' WHERE `id`=\'' + line + '\'';
    }
}
module.exports = consts;

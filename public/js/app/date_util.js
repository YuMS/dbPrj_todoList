/**
 * Created with JetBrains WebStorm.
 * User: YuMS
 * Date: 13-2-27
 * Time: 下午11:36
 * To change this template use File | Settings | File Templates.
 */
define(['exports'], function(exports){
    pad = function(n){return n<10 ? '0' + n : n},
    exports.toMySQLDate = function(d) {
        return d.getFullYear() + '-'
            + pad(d.getMonth() + 1)+'-'
            + pad(d.getDate()) + ' '
            + pad(d.getHours()) + ':'
            + pad(d.getMinutes()) + ':'
            + pad(d.getSeconds());
    }
});
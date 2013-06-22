/**
 * Created with JetBrains WebStorm.
 * User: YuMS
 * Date: 13-2-27
 * Time: 下午1:24
 * To change this template use File | Settings | File Templates.
 */

define(['jquery'], function($) {
    return function(id) {
        var data = {
            type: 'delete',
            id: id
        }
//        alert(data.id + data.status);
        $.ajax( {
            type: 'POST',
            url: '/todo',
            data: data,
            success: function(data) {
                $('#li' + id).slideUp('fast');
//                $('#todotext' + id).addClass('donetext');
            }
        });
        return false;
    }
});

/**
 * Created with JetBrains WebStorm.
 * User: YuMS
 * Date: 13-2-27
 * Time: 上午10:19
 * To change this template use File | Settings | File Templates.
 */

define(['jquery'], function($) {
    return function(id, status) {
        var data = {
            type: 'toggle',
            id: id,
            status: status
        }
//        alert(data.id + data.status);
        $.ajax( {
            type: 'POST',
            url: '/todo',
            data: data,
            success: function(data) {
//                console.log(status);
//                console.log(data);
                if (status) {
                    $('#todotext' + id).removeClass('donetext');
                } else {
                    $('#todotext' + id).addClass('donetext');
                }
            }
        });
        return false;
    }
});

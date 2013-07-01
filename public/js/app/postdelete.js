/**
 * Author: YuMS
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

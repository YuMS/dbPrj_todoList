/**
 * Author: YuMS
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

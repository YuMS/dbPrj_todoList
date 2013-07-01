/**
 * Author: YuMS
 */

define(['jquery', 'app/posttoggle', 'app/postdelete', 'app/date_util'], function($, posttoggle, postdelete, date_util) {
    return function(text) {
        var data = {
            type: 'insert',
            text: text
        }
        $.ajax( {
            type: 'POST',
            url: '/todo',
            data: data,
            success: function(id) {
//                alert('success'+id);
                var d = new Date();
                var newline = $('#templateli').clone();
                newline.find('.itemnumber').text(id);
                newline.find('#todotext').text($('#inputedit').val());
                newline.find('#done').attr('id', 'done' + id);
                newline.find('.donelabel').attr('for', 'done' + id);
                newline.find('#todotext').attr('for', 'done' + id);
                newline.find('#todotext').attr('id', 'todotext' + id);
                newline.find('.itemtime').text(date_util.toMySQLDate(d));
                newline.find('#delete').attr('id', 'delete' + id);
                newline.attr('id', 'li' + id);
                newline.find('.tickcheck').on('click', function() {
                    posttoggle(this.id.substr(4), !$(this).prop('checked'));
//                        $('#todotext' + this.id.substr(4)).toggleClass('donetext');
                });
                newline.find('.delete').on('click', function() {
                    if (confirm('Don\' t delete your history unless you didn\' t mean to create it. Sure?')) {
                        postdelete(this.id.substr(6));
                    };
                });
//                    $(newline).prependTo('#multicolomnlist').show('fast');
                $(newline).prependTo('#multicolomnlist').slideDown('fast');
                $('#inputedit').val("");
            }
        }  );
    }
});

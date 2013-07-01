/**
 * Created with JetBrains WebStorm.
 * User: YuMS
 * Date: 13-2-26
 * Time: 上午10:30
 * To change this template use File | Settings | File Templates.
 */

requirejs.config({
    baseUrl: '../js/lib',
    paths: {
        app: '../app'
    }
});

require(['jquery', 'app/posttoggle', 'app/postdelete', 'app/postinsert', 'app/date_util'], function($, posttoggle, postdelete, postinsert, date_util) {
    $(document).ready(function() {
        $('.tickcheck').on('click', function(){
            posttoggle(this.id.substr(4), !$(this).prop('checked'));
//            $('#todotext' + this.id.substr(4)).toggleClass('donetext');
        });
        $('.delete').on('click', function(){
            if (confirm('Don\' t delete your history unless you didn\' t mean to create it. Sure?')) {
                postdelete(this.id.substr(6));
            };
//            $('#todotext' + this.id.substr(4)).toggleClass('donetext');
        });
        $('#inputform').on('submit', function() {
//            alert('submit');
            postinsert($('#inputedit').val());
            return false;
        });
        $('.itemtime').each(function() {
            if ($(this).text()) {
                var fakeUTC = new Date($(this).text());
                var date = new Date(Date.UTC(fakeUTC.getFullYear(), fakeUTC.getMonth(), fakeUTC.getDate(), fakeUTC.getHours(), fakeUTC.getMinutes(), fakeUTC.getSeconds()));
                $(this).text(date_util.toMySQLDate(date));
            }
        });
    });
});
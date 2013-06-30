requirejs.config({
    baseUrl: "../js/lib",
    paths: {
        "bootstrap": "bootstrap.min"
    },
    shim: {
        "bootstrap": {deps: ["jquery"]}
    }
});

require(["jquery", "bootstrap"],
function($, bootstrap){
    var reposition = function() {
        //centering wrapper
        var outY;
        var inY;
        outY = $('#login-panel').height();
        inY = $('#login-wrapper').height();
        outY = outY - inY;
        if (outY < 0) outY = 0;
        $('#login-wrapper').css('margin-top', outY / 2);
    }
    $(window).resize(reposition);
    $(document).ready(function(){
        reposition();
        $('#login-wrapper').show();
        $("#login-btn").click(function(){
            var submitok=true;
            if($("#username").val()==""){
                submitok=false;
                $("#username").attr("placeholder", "帐号未输入");
            }
            if($("#password").val()==""){
                submitok=false;
                $("#password").attr("placeholder", "密码未输入");
            }
            if(!submitok){
                return false;
            }
            else return true;
        });

        $("input").focus(function(){
            $(".text-error").remove();
        });
    });
});
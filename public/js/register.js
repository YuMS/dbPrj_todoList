requirejs.config({
    baseUrl: "../js/lib",
    paths: {
        "bootstrap": "bootstrap.min",
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
        outY = $('#register-panel').height();
        inY = $('#register-wrapper').height();
        outY = outY - inY;
        if (outY < 0) outY = 0;
        $('#register-wrapper').css('margin-top', outY / 2);
    }
    $(window).resize(reposition);
    $(document).ready(function(){
        reposition();
        $('#register-wrapper').show();
        $("#confirm-btn").click(function(){
            var submitok=true;
            var regUsername = /^[\w\!\@\#\$\%\&\^\*\+\-\=\.\~\_]+$/;
            if($("#name").val()==""){
                submitok=false;
                $("#name").attr("placeholder", "帐号未输入");
            } else if(!regUsername.test($("#name").val()) || $("#name").val().length<4) {
                submitok = false;
                $("#name").val("");
                $("#name").attr("placeholder", "至少4位a-zA-Z0-9~!@#$%^&*+-");
            }

            if($("#password").val()==""){
                submitok=false;
                $("#password").attr("placeholder", "密码未输入");
            } else if($("#password").val().length<6){
                submitok=false;
                $("#password").attr("placeholder", "密码至少六位");
            }

            if($("#password2").val()!=$("#password").val()){
                submitok=false;
                $("#password2").attr("placeholder", "密码确认不一致");
            }
            if($("#email").val()==""){
                submitok=false;
                $("#email").attr("placeholder", "邮箱未输入");
            }else{
                var regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,5})+)$/
                if(!regEmail.test($("#email").val())){
                    submitok=false;
                    $("#email").val("");
                    $("#email").attr("placeholder", "邮箱格式错误");
                }
            }
            if(!submitok){
                $("#password").val("");
                $("#password2").val("");
                return false;
            }
            else return true;
        });

        $("input").focus(function(){
            $(".text-error").remove();
        });
    });
});
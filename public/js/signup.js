/**
 * Author: zhoutall
 */

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
        outY = $('#signup-panel').height();
        inY = $('#signup-wrapper').height();
        outY = outY - inY;
        if (outY < 0) outY = 0;
        $('#signup-wrapper').css('margin-top', outY / 2);
    }
    $(window).resize(reposition);
    $(document).ready(function(){
        reposition();
        $('#signup-wrapper').show();
        $("#confirm-btn").click(function(){
            var submitok=true;
            var regUsername = /^[\w\!\@\#\$\%\&\^\*\+\-\=\.\~\_]+$/;
            if($("#name").val()==""){
                submitok=false;
                $("#name").attr("placeholder", "Pick an account name");
            } else if(!regUsername.test($("#name").val()) || $("#name").val().length<4) {
                submitok = false;
                $("#name").val("");
                $("#name").attr("placeholder", "> 4 of a-zA-Z0-9~!@#$%^&*+-");
            }

            if($("#password").val()==""){
                submitok=false;
                $("#password").attr("placeholder", "Input your password here");
            } else if($("#password").val().length<6){
                submitok=false;
                $("#password").attr("placeholder", "Use at least 6 characters");
            }

            if($("#password2").val()!=$("#password").val()){
                submitok=false;
                $("#password2").attr("placeholder", "inconsistent");
            }
            if($("#email").val()==""){
                submitok=false;
                $("#email").attr("placeholder", "Your email");
            }else{
                var regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,5})+)$/
                if(!regEmail.test($("#email").val())){
                    submitok=false;
                    $("#email").val("");
                    $("#email").attr("placeholder", "Invalid Email address");
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
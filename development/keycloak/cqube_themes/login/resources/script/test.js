function onChange() {
    if (document.getElementById("password1").value.length > 0) {
        document.getElementById("togglePassword").style.display = 'block';
    } else {
        document.getElementById("togglePassword").style.display = 'none';
    }
}

function myFun() {
    if (document.getElementById("password1").value.length > 0 && document.getElementById("username1").value.length > 0) {
        document.getElementById("login").style.backgroundColor = "#31D08C";
        document.getElementById("login").style.color = "white";
        document.getElementById("signinSymbol").style.display = "none";
        document.getElementById("signinSymbolWithInput").style.display = "block";
    } else {
        document.getElementById("login").style.color = "#899BFF";
        document.getElementById("login").style.backgroundColor = "transparent";
        document.getElementById("signinSymbol").style.display = "block";
        document.getElementById("signinSymbolWithInput").style.display = "none";
    }
}
function test(el) {
    $(el).toggleClass('fa-eye-slash');
}

function onClick(el) {
    document.getElementById("kc-login").style.display = "none";
}
$(window).on('load', function () {
    if ($('#totp').length || $('#otp').length || $('#kc-passwd-update-form').length) {
        document.getElementById("kc-form-login1").style.display = "none";
        document.getElementById("kc-login").style.display = "block";
        document.getElementById('kc-passwd-update-form').style.display = "block";
    } else {
        document.getElementById("kc-form-login1").style.display = "block";
    }
});

$(document).ready(function () {
    $('#totp').on('input', function () {
        document.getElementsByClassName("btn-primary")[0].style.backgroundColor = "#31D08C";
    });
});

$(document).ready(function () {
    var $winwidth = $(window).width();
    $(".background").attr({
        width: $winwidth
    });
    $(window).bind("resize", function () {
        $winwidth = $(window).width();
        $(".background").attr({
            width: $winwidth
        });
    });
}); 
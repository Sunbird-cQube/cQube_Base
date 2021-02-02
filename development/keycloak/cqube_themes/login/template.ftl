<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false displayWide=false showAnotherWayIfPresent=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" class="${properties.kcHtmlClass!}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <script  type="text/javascript">
    function onChange(){
        if(document.getElementById("password1").value.length > 0){
            document.getElementById("togglePassword").style.display = 'block';
        }else{
            document.getElementById("togglePassword").style.display = 'none';
        }
    }

    function myFun(){
        if(document.getElementById("password1").value.length > 0 && document.getElementById("username1").value.length > 0){
            document.getElementById("login").style.backgroundColor = "#31D08C";
            document.getElementById("login").style.color = "white";
            document.getElementById("signinSymbol").style.display = "none";
            document.getElementById("signinSymbolWithInput").style.display = "block"; 
        }else{
            document.getElementById("login").style.color = "#899BFF";
            document.getElementById("login").style.backgroundColor = "transparent";
            document.getElementById("signinSymbol").style.display = "block";
            document.getElementById("signinSymbolWithInput").style.display = "none";
        }
    }
    function test(el){
      $(el).toggleClass('fa-eye-slash');
      var className = $(el).attr('class');
   }

  function onClick(el){
       document.getElementById("kc-form-login1")
       document.getElementById("kc-login").style.display = "none";
   }
   $(window).on('load', function(){
       if ($('#totp').length){
           document.getElementById("kc-form-login1").style.display = "none";
           document.getElementById("kc-login").style.display = "block";
       }else{
           document.getElementById("kc-form-login1").style.display = "block";
       }
    });

    $(document).ready(function(){
        $('#totp').on('input', function(){
            document.getElementsByClassName("btn-primary")[0].style.backgroundColor = "#31D08C";
        });
    });

        $(document).ready(function() { 
		var $winwidth = $(window).width();
		$(".background").attr({
			width: $winwidth
		});
		$(window).bind("resize", function(){ 
			var $winwidth = $(window).width();
			$(".background").attr({
				width: $winwidth
			});
		 });
	}); 
    </script>
</head>

<body class="background">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="logo">
                    <img src="${url.resourcesPath}/img/GroupLogo.svg" alt="">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-5 col-sm-12">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="logoText">
                            <p>cQube</p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="card-pf">
                            <div id="kc-content-wrapper">
                              <#-- App-initiated actions should not see warning messages about the need to complete the action -->
                              <#-- during login.                                                                               -->
                              <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                                  <div class="alert alert-${message.type}">
                                      <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                                      <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                                      <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                                      <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                                      <span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span>
                                  </div>
                              </#if>
                    
                              <#if realm.password>
                                <div>
                                   <form autocomplete="off" id="kc-form-login1" class="form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                                        <label>User ID </label><br/>
                                        <input id="username1" oninput="myFun();" class="login-field" placeholder="${msg("Enter your user ID")}" type="text" name="username" tabindex="1">
                                        <br/><br/>
                                        <label>Password</label><br/>
                                        <input id="password1" oninput="onChange(); myFun();" class="login-field" placeholder="${msg("Enter your password")}" type="password" name="password" tabindex="2">
                                        <i class="far fa-eye" id="togglePassword" onclick="if (password1.type == 'text') password1.type = 'password';
                                            else password1.type = 'text'; test(this)" style="display:none;"></i>
                                        <br/><br/>
                                        <input class="submit" type="submit" onclick="onClick(this)" id="login" value="Login" tabindex="3">
                                        <img src="${url.resourcesPath}/img/Shape1.svg" aria-hidden="true" id="signinSymbol">
                                        <img src="${url.resourcesPath}/img/Shape.svg" aria-hidden="true" id="signinSymbolWithInput">
                                    </form>
                                </div>
                            </#if>
                            <#nested "form">
                    
                              <#if auth?has_content && auth.showTryAnotherWayLink() && showAnotherWayIfPresent>
                              <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post" <#if displayWide>class="${properties.kcContentWrapperClass!}"</#if>>
                                  <div <#if displayWide>class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}"</#if>>
                                      <div class="${properties.kcFormGroupClass!}">
                                        <input type="hidden" name="tryAnotherWay" value="on" />
                                        <a href="#" id="try-another-way" onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
                                      </div>
                                  </div>
                              </form>
                              </#if>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-sm-12">
                        <div class="infoText" style="color: white; padding: 0px 20px 20px 0px; margin-left: 50px;">
                            <h1 style="color:white; font-size: 38px; font-weight: bold;">Headline text goes here</h1>
                            <p>Ability to break the information at different administrative
                                levels- District, Block, Cluster and School <br />
                                Ability to download data at multiple administrative levels <br />
                                Ability to zoom in and out across multiple administrative levels
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7 col-sm-12">
                <div class="backImg">
                    <img src="${url.resourcesPath}/img/back1.png"">
                </div>

            </div>
        </div>
    </div>
</body>
   
</html>
</#macro>

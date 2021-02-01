<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false displayWide=false showAnotherWayIfPresent=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" class="${properties.kcHtmlClass!}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
    <meta name="robots" content="noindex, nofollow">
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
       var className = $(el).attr('class');
       console.log(className);
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
    </script>
</head>

<body class="${properties.kcBodyClass!}">
  <div class="${properties.kcLoginClass!}">
    <div id="kc-header" class="${properties.kcHeaderClass!}">
      <div id="kc-header-wrapper" class="${properties.kcHeaderWrapperClass!}">${kcSanitize(msg("",(realm.displayNameHtml!'')))?no_esc}</div>
      <div class="logoText" style="font-size:90px; font-spacing:-1px;">cQube</div>
    </div>    
    <div class="${properties.kcFormCardClass!} <#if displayWide>${properties.kcFormCardAccountClass!}</#if>">
      <header class="${properties.kcFormHeaderClass!}">
        <#if realm.internationalizationEnabled  && locale.supported?size gt 1>
            <div id="kc-locale">
                <div id="kc-locale-wrapper" class="${properties.kcLocaleWrapperClass!}">
                    <div class="kc-dropdown" id="kc-locale-dropdown">
                        <a href="#" id="kc-current-locale-link">${locale.current}</a>
                        <ul>
                            <#list locale.supported as l>
                                <li class="kc-dropdown-item"><a href="${l.url}">${l.label}</a></li>
                            </#list>
                        </ul>
                    </div>
                </div>
            </div>
        </#if>
        <#if !(auth?has_content && auth.showUsername() && !auth.showResetCredentials())>
            <#if displayRequiredFields>
                <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                        <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                    </div>
                    <div class="col-md-10">
                        <h1 id="kc-page-title"><#nested "header"></h1>
                    </div>
                </div>
            <#else>
                <h1 id="kc-page-title"><#nested "header"></h1>
            </#if>
        <#else>
            <#if displayRequiredFields>
                <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                        <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                    </div>
                    <div class="col-md-10">
                        <#nested "show-username">
                        <div class="${properties.kcFormGroupClass!}">
                            <div id="kc-username">
                                <label id="kc-attempted-username">${auth.attemptedUsername}</label>
                                <a id="reset-login" href="${url.loginRestartFlowUrl}">
                                    <div class="kc-login-tooltip">
                                        <i class="${properties.kcResetFlowIcon!}"></i>
                                        <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <#else>
                <#nested "show-username">
                <div class="${properties.kcFormGroupClass!}">
                    <div id="kc-username">
                        <label id="kc-attempted-username">${auth.attemptedUsername}</label>
                        <a id="reset-login" href="${url.loginRestartFlowUrl}">
                            <div class="kc-login-tooltip">
                                <i class="${properties.kcResetFlowIcon!}"></i>
                                <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
                            </div>
                        </a>
                    </div>
                </div>
            </#if>
        </#if>
      </header>
      <div id="kc-content">
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

          <#if displayInfo>
              <div id="kc-info" class="${properties.kcSignUpClass!}">
                  <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                      <#nested "info">
                  </div>
              </div>
          </#if>
        </div>
              </div>
      
    </div>
    <div class="infoText">
        <h1 style="color:white; font-size: 32px; font-weight: bold;font-family: "Noto Sans"; padding-botton: 20px;">Headline text goes here</h1>
        <p>Ability to break the information at different administrative 
        levels- District, Block, Cluster and School
Ability to download data at multiple administrative levels
Ability to zoom in and out across multiple administrative levels</p>
    </div>
  </div>
   <br>
    </body>
   
</html>
</#macro>

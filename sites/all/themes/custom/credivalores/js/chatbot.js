var fogataAuthKey = 'd8e420a8e921530a97ed718f44a6cc37950ebcc3';
(function($, Drupal) {

    $(document).ready( function() {

        $('#bot-draggable-webchat').html(' \
        <span class="bot-close-chat" style="cursor: pointer;"><i class="fa fa-times" aria-hidden="true"></i></span> \
        <div id="bot-webchat-title"> \
        <img src="https://bots.aldeamo.com/img/credivalores.png" /> \
        <div class="bot-webchat-title-text"> \
        <h3>Hola, soy CrediBot de Crediuno</h3> \
            <p>¿En qué puedo ayudarte hoy?</p> \
        </div> \
        </div> \
        <div id="bot-webchat-content"> \
        <div id="fogata-bot-response"> \
            <div id="fogata-bot-lead"> \
            <p>Por favor ingresa tus datos para continuar</p> \
            <fieldset> \
                <div class="fogata-bot-inputContainer"> \
                <input type="text" name="fogata-name" class="fogata-bot-input fogata-name" id="fogata-name" placeholder="Nombre" maxlength="30"> \
                </div> \
            </fieldset> \
            <fieldset> \
                <div class="fogata-bot-inputContainer"> \
                <input type="email" name="fogata-email" class="fogata-bot-input fogata-email" placeholder="Cédula" maxlength="255"> \
                </div> \
            </fieldset> \
            <fieldset> \
                <div class="fogata-bot-inputContainer"> \
                <input type="tel" name="fogata-phone" class="fogata-bot-input fogata-phone" placeholder="Teléfono" maxlength="25"> \
                </div> \
            </fieldset> \
            <button class="fogata-bot-start">Enviar</button> \
            </div> \
            </div> \
        </div> \
        <div id="bot-webchat-form"> \
        <label class="bot-webchat-menu fogata-menu-chat"> \
            <svg> \
            <g> \
                <rect y="0" width="25" height="1"/> \
                <rect y="6" width="25" height="1"/> \
                <rect y="12" width="25" height="1"/> \
                <rect y="18" width="25" height="1"/> \
            </g> \
            </svg> \
        </label> \
        <div class="bot-webchat-input"> \
            <input class="fogata-user-text" type="text" value="" placeholder="Escribe un mensaje..." disabled> \
        </div> \
        <label class="bot-webchat-send fogata-menu-send"><svg><path d="M26.79 9.38A0.31 0.31 0 0 0 26.79 8.79L0.41 0.02C0.36 0 0.34 0 0.32 0 0.14 0 0 0.13 0 0.29 0 0.33 0.01 0.37 0.03 0.41L3.44 9.08 0.03 17.76A0.29 0.29 0 0 0 0.01 17.8 0.28 0.28 0 0 0 0.01 17.86C0.01 18.02 0.14 18.16 0.3 18.16A0.3 0.3 0 0 0 0.41 18.14L26.79 9.38ZM0.81 0.79L24.84 8.79 3.98 8.79 0.81 0.79ZM3.98 9.37L24.84 9.37 0.81 17.37 3.98 9.37Z"></path></svg></label> \
        </div>');
    
                $('#bot-draggable-webchat').click(function(){
                $(this).css('height', '480px');
                });
    
                $('.bot-close-chat').click(function( event ){
                $('#bot-draggable-webchat').css('height', '85px');
                event.stopPropagation();
                return false;
                });
    });


$(document).ready(function () {

    var chatHtml;
    var fogataLiveUser = 0;
    var fogataActive = 0;
    var fogataClientIP;
    var fogataClientDV;
    var token;
  
    $("body").prepend("");
    // $( "#fogata-draggable-webchat" ).draggable();
    // $( "#bot-draggable-webchat" ).draggable();
  
    $.get( "https://fogatacrm.com/chatbot/chat.php", function( data ) {
      var datas = JSON.parse(data);
      fogataClientIP = datas['ipaddress'];
      fogataClientDV = datas['device'];
    });
  
    $.fn.toggleClick = function(){
        var methods = arguments, // store the passed arguments for future reference
            count = methods.length; // cache the number of methods
        //use return this to maintain jQuery chainability
        return this.each(function(i, item){
            // for each element you bind to
            var index = 0; // create a local counter for that element
            $(item).click(function(){ // bind a click handler to that element
                return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
                // the index % count means that we constrain our iterator between 0 and (count-1)
            });
        });
    };
  
    jQuery.each( [ "put" ], function( i, method ) {
      jQuery[ method ] = function( url, data, callback, type ) {
        if ( jQuery.isFunction( data ) ) {
          type = type || callback;
          callback = data;
          data = undefined;
        }
  
        return jQuery.ajax({
          url: url,
          type: method,
          dataType: type,
          data: data,
          success: callback
        });
      };
    });
  
    $('.fogata-chat-btn').toggleClick(function(){
      $('.fogata-chats').show();
      $('.fogata-user-text').focus();
    })
  
    $('.fogata-close-chat').click(function(){
      $('.fogata-chats').hide();
    })
  
    $('.fogata-bot-start').click(function(){
  
      var fogataName = $( ".fogata-name" ).val();
      var fogataEmail = $( ".fogata-email" ).val();
      var fogataPhone = $( ".fogata-phone" ).val();
  
      $('#fogata-bot-lead').css('height','0').hide();
      $('#fogata-bot-response').html('');
      $('#bot-webchat-form').css('opacity','1').show();
      $(".fogata-user-text").prop( "disabled", false );
  
      startAni();
      $('#fogata-bot-loading').show();
  
      $.put('https://bots.aldeamo.com/api/admin/index.php/credivalores/user', {user: fogataClientIP, name: fogataName, email: fogataEmail, auth: fogataAuthKey, phone: fogataPhone, usr_dev: fogataClientDV}, function( data ){
  
        clearInterval(loadingAni);
        $('#fogata-bot-loading').hide();
      })
      .fail(function( jqXhr, textStatus, errorThrown ) {
        console.log( errorThrown );
      });
  
      getFogataWelcome();
    })
  
    $(document).on("click", ".fogata-auto-text", function() {
      $('.fogata-user-text').val($(this).html()).focus();
    })
  
    $(document).on('click', '.fogata-option-button', function(){
      var fogval = $(this).html();
      sendFogataMsg(fogval,1,0,0);
    })
  
    $(document).on('click', '.fogata-encuesta-response', function(){
      var fogval = $(this).html();
      var fogval2 = $(this).data('id');
      var fogval3 = $(this).data('key');
  
      sendFogataMsg(fogval,2,fogval2,fogval3);
    })
  
    $('.fogata-menu-chat').click(function(){
      sendFogataMsg('MenÃº',1,0,0);
    })
  
    $('.fogata-menu-send').click(function(){
      var fogvalText = '';
      fogvalText = $('.fogata-user-text').val();
      sendFogataMsg(fogvalText,1,0,0);
      $('.fogata-user-text').val('');
    })
  
    function setLive() {
  
      $.put('https://bots.aldeamo.com/api/admin/index.php/credivalores/live', {user: fogataClientIP, auth: fogataAuthKey, usr_dev: fogataClientDV}, function( data ){
  
        var datas = JSON.parse(data.data);
  
        if(datas.bot == 1) fogataActive = 1;
        else fogataActive = 0;
  
        if(datas.mensaje != '') {
  
          startAni();
          $('#fogata-bot-loading').show();
  
          var html = $('#fogata-bot-response').html();
          $('#fogata-bot-response').html(html + datas.mensaje);
          $("#fogata-bot-response").animate({scrollTop: $("#fogata-bot-response")[0].scrollHeight},400,"linear");
  
          clearInterval(loadingAni);
          $('#fogata-bot-loading').hide();
        }
  
        fogataLiveUser = 1;
        setTimeout(setLive, 3000);
  
      })
      .fail(function( jqXhr, textStatus, errorThrown ) {
        console.log( errorThrown );
      });
  
    };
  
    function sendFogataMsg(txt,fogval,fogval2,fogval3){
  
      if(fogataLiveUser == 0) setTimeout(setLive, 3000);
      startAni();
      $('#fogata-bot-loading').show();
  
      $.put('https://bots.aldeamo.com/api/admin/index.php/credivalores/newchat', {user: fogataClientIP, msg: encodeURI(txt), type: fogval, auth: fogataAuthKey, bots_key_id: fogval2, keyenc: fogval2, keyenc_id: fogval3, usr_dev: fogataClientDV, token:token}, function( data ){
  
        var datas = JSON.parse(data.data);
        var botones = '';
        var html = $('#fogata-bot-response').html();
  
        if(fogataActive == 0) {
          $('#fogata-bot-response').html(html + '<div style="width: 100%; float: left;"><div class="fogata-usr-response">'+txt+'</div></div>'+
          '<div style="width: 100%; float: left;"><div class="fogata-bot-response">'+datas.mensaje+'</div></div><div style="width: 100%; float: left;">' + datas.botones + '</div>');
        } else {
          $('#fogata-bot-response').html(html + '<div style="width: 100%; float: left;"><div class="fogata-usr-response">'+txt+'</div></div>');
  
        }
        $("#fogata-bot-response").scrollTop();
  
        $("#fogata-bot-response").animate({scrollTop: $("#fogata-bot-response")[0].scrollHeight},400,"linear");
  
        clearInterval(loadingAni);
        $('#fogata-bot-loading').hide();
      })
      .fail(function( data ) {
        console.log( JSON.stringify(data) );
      });
  
    };
  
    function getFogataWelcome(){
  
      startAni();
      $('#fogata-bot-loading').show();
  
      $.get( "https://bots.aldeamo.com/api/admin/index.php/credivalores/welcome?auth="+ fogataAuthKey, function( data ) {
  
        var html = $('#fogata-bot-response').html();
  
        $('#fogata-bot-response').html(html +
        '<div style="width: 100%; float: left;"><div class="fogata-bot-response">'+data.data+'</div></div>');
  
        $("#fogata-bot-response").scrollTop();
  
        $("#fogata-bot-response").animate({scrollTop: $("#fogata-bot-response")[0].scrollHeight},400,"linear");
  
        clearInterval(loadingAni);
        $('#fogata-bot-loading').hide();
      })
      .fail(function( jqXhr, textStatus, errorThrown ) {
        console.log( errorThrown );
      });
  
    };
  
    function sendFogataUser(){
      startAni();
      $('#fogata-bot-loading').show();
  
      var fogataName = $( "#fogata-name" ).attr('value');
      var fogataEmail = $( ".fogata-email" ).val();
      var fogataPhone = $( ".fogata-phone" ).val();
  
      console.log(fogataClientIP + ' ' + fogataName+ ' ' + fogataEmail+ ' ' + fogataAuthKey+ ' ' + fogataPhone+ ' ' + fogataClientDV);
    //  181.197.176.130 undefined undefined d8e420a8e921530a97ed718f44a6cc37950ebcc3 undefined Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36
  
      $.put('https://bots.aldeamo.com/api/admin/index.php/credivalores/user', {user: fogataClientIP, name: fogataName, email: fogataEmail, auth: fogataAuthKey, phone: fogataPhone, usr_dev: fogataClientDV}, function( data ){
  
        clearInterval(loadingAni);
        $('#fogata-bot-loading').hide();
      })
      .fail(function( jqXhr, textStatus, errorThrown ) {
        console.log( errorThrown );
      });
  
    };
  
    $(document).on('keypress', '.fogata-user-text', function() {
      var fogvalText = '';
      var key = window.event.keyCode;
      fogvalText = $(this).val();
      if(fogvalText != '' && key == 13){
        $(this).val('');
        sendFogataMsg(fogvalText,1,0);
      }
    })
  
    var loadingAni;
    var toggleSlide = function(){
      $(".fogata-loading-animation .fogata-loading-bot.fogata-greener").removeClass('fogata-greener').css('background-color','#e2e2e2')
         .next().add(".fogata-loading-animation .fogata-loading-bot:first").last().addClass("fogata-greener").css('background-color','green');
    }
  
    function startAni(){
      loadingAni = setInterval(toggleSlide, 400);
    }
  
  });
})(jQuery, Drupal);
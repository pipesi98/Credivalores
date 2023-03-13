/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  "use strict";
  $('ul#menu-flotante a[href^="#"]').bind("click", function (e) {
    e.preventDefault();
    var target = this.hash,
      $target = $(target);

    $("html, body").stop().animate(
      {
        scrollTop: $target.offset().top,
      },
      900,
      "swing"
    );
    if ($(".item-link").hasClass("active")) {
      $(".item-link").removeClass("active");
      $(this).addClass("active");
    } else {
      $(this).addClass("active");
    }
  });

  if (
    $(".path-frontpage").length > 0 ||
    $(".path-canales-atencion").length > 0
  ) {
    function functionModalCanal(url) {
      $.getJSON(url, function (data) {
        let html_modal = "";
        let titlesFooter = "";
        let bntsModal = "";
        if (data[0].imagen) {
          html_modal =
            `<div class="container-fluid">` +
            `<div class="row">` +
            `<div class="col-4">` +
            `<img class="img-fluid" src="${data[0].imagen}">` +
            ` </div>` +
            `<div class="col-8">` +
            `<h2>${data[0].titulo}</h2>` +
            `${data[0].cuerpo}` +
            `</div>` +
            `</div>` +
            `</div>`;
        } else {
          html_modal =
            `<div class="container-fluid">` +
            `<div class="row">` +
            `<div class="col-12">` +
            `<h2>${data[0].titulo}</h2>` +
            `${data[0].cuerpo}` +
            `</div>` +
            `</div>` +
            `</div>`;
        }

        if (
          data[0].enlaces_canales ||
          data[0].subtitulo_footer ||
          data[0].subtitulo_footer
        ) {
          if (data[0].enlaces_canales) {
            var url = "/api/paragraph/" + data[0].nid + "?_format=json";

            $.getJSON(url, function (data) {
              let i = 0;
              bntsModal += `<div class="itemFooter">`;
              for (i; i < data.length; i++) {
                if (data[i].imagen) {
                  bntsModal += `<a class="linkBtn" style="background: url(${data[i].imagen}) center no-repeat" href="${data[i].url}"></a>`;
                } else {
                  bntsModal += `<a class="linkText" href="${data[i].url}">${data[i].url_texto}</a>`;
                }
              }
              bntsModal += `</div>`;

              $("#canales .modalFooter").append(bntsModal);
            });
          }

          if (data[0].subtitulo_footer || data[0].titulo_footer) {
            $(".modalFooter").addClass("modalFooterShow");
            titlesFooter +=
              `<div class="itemFooter">` +
              `<h2>${data[0].titulo_footer}</h2>` +
              `<h3>${data[0].subtitulo_footer}</h3>` +
              `</div>`;
          }
        }

        $("#canales .modal-body").html(html_modal);
        $("#canales .modalFooter").append(titlesFooter);
        $("#canales").modal();

        $(".close-modal").click(() => {
          $("#canales .modal-body").html("");
          $("#canales .modalFooter").html("");
          $(".modalFooter").removeClass("modalFooterShow");
        });
      });
    }

    function getUrlVars() {
      var vars = [],
        hash;
      var hashes = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    }

    //modal canales
    $(".canalesid").on("click", function (e) {
      e.preventDefault();

      var idcanal = $(this).data("id");
      var url = "/api/canales/" + idcanal + "?_format=json";
      functionModalCanal(url);
    });

    $(window).on("load", function () {
      var canalId = getUrlVars()["canalid"];
      if (canalId != undefined) {
        console.log(canalId);
        var url = "/api/canales/" + canalId + "?_format=json";
        functionModalCanal(url);
        //$('#canales').modal('show');
      }
    });
  }

  // Manu responsive

  if ($(window).width() < 520) {
    //set first elemeent menu footer active
    $("footer .menu-footer .row > div > h2").first().addClass("is-active");
    $("footer .menu-footer .row > div > ul")
      .first()
      .addClass("active-dropdown-foo");

    $("footer .menu-footer .row > div > h2").last().addClass("is-active");
    $("footer .menu-footer .row > div > ul")
      .last()
      .addClass("active-dropdown-foo");

    $("footer .menu-footer  h2").on("click", function (e) {
      //remove class all items

      let navSelected = $(this).next();

      if (navSelected.hasClass("active-dropdown-foo")) {
        navSelected.removeClass("active-dropdown-foo");
        $("body footer nav ul").removeClass("active-dropdown-foo");
        $(this).removeClass("is-active");
      } else {
        $("body footer nav ul").removeClass("active-dropdown-foo");
        navSelected.addClass("active-dropdown-foo");
        $("footer nav > h2").removeClass("is-active");
        $(this).addClass("is-active");
      }
    });
  }

  if ($(".sectProduct .acordeon-js").length > 0) {
    $(".acordeon-js h4").first().addClass("is-active");
    $(".acordeon-js ul").first().addClass("active-dropdown-foo");
    $(".acordeon-js h4").on("click", function (e) {
      //remove class all items

      let navSelected = $(this).next();

      if (navSelected.hasClass("active-dropdown-foo")) {
        navSelected.removeClass("active-dropdown-foo");
        $(".acordeon-js ul").removeClass("active-dropdown-foo");
        $(this).removeClass("is-active");
      } else {
        $(".acordeon-js ul").removeClass("active-dropdown-foo");
        navSelected.addClass("active-dropdown-foo");
        $(".acordeon-js h4").removeClass("is-active");
        $(this).addClass("is-active");
      }
    });
  }

  //resize font
  $("#changeFontSize").on("input", function () {
    $("header .top-bar .content-menu ul li a").css(
      "font-size",
      $(this).val() + "px"
    );
    $("header .main-menu .menu-main-li ul.ultimenu--main li span").css(
      "font-size",
      parseInt($(this).val()) + 1 + "px"
    );
    $(".breadcrumb").css("font-size", parseInt($(this).val()) - 1 + "px");
    $("body p, footer ul li a, #menu-flotante li a, article ul li").css(
      "font-size",
      parseInt($(this).val()) + 2 + "px"
    );
    $(".clsMainBanner p.parrafo-title").css("font-size", 3 + "rem");
    $("header .top-bar .content-resize p.mas-resizer").css(
      "font-size",
      29 + "px"
    );
    $("header .top-bar .content-resize p.menos-resizer").css(
      "font-size",
      20 + "px"
    );
  });

  $("#btn_search").click(function () {
    let consulta = $("#inp_search").val().toLowerCase();
    let coincidencias = 0;
    if (consulta.length >= 3) {
      for (let i = 0; i < $(".container_ask").length; i++) {
        $("#container_ask_" + i).slideUp();
      }

      for (let i = 0; i < $(".container_ask").length; i++) {
        let texto = $("#container_ask_text_" + i)
          .text()
          .toLowerCase();
        if (texto.indexOf(consulta) != -1) {
          coincidencias++;
          $("#container_ask_" + i).slideDown("fast");
        } else {
          $("#container_ask_" + i).slideUp("fast");
        }
      }
      $("#totalcoincidencias").text(coincidencias);
    } else {
      for (let i = 0; i < $(".container_ask").length; i++) {
        $("#container_ask_" + i).slideDown();
        $("#totalcoincidencias").text("0");
      }
    }
  });


  //Accordeon footer
  const activeTabsCollapse = function () {
    $(".acordeon").on("click", function () {
      console.log(`Lo que sea`);
      $(".acordeon").removeClass("active");

      $(this).toggleClass("active");

      const dataTarget = $(this).data("target");


      if ( $(".contenido[data-content='" + dataTarget + "']").hasClass("active") ) {

        $(".contenido").removeClass("active");
        
      } else {
        $(".contenido.active").removeClass("active");
        $(".contenido[data-content='" + dataTarget + "']").addClass("active");
      }
    });
  };

  activeTabsCollapse();

   //Ancla Credibot
  
   $('.credibot').click(function(e){        
    e.preventDefault();   //evitar el eventos del enlace normal
    var strAncla=$(this).attr('href'); //id del ancla
      $('body,html').stop(true,true).animate({        
        scrollTop: $(strAncla).offset().top
      },1000);
    
  });

  // datalayer form pauta

  if($('body').hasClass('page-node-352')){

    if($('.webform-confirmation').length){

      dataLayer.push({
        'event': 'lead_libranza_deeploy_cv',
      });
    }
    
  }
  //Alto contraste
  $('.dark-theme').click(() => {
    $('body').addClass('dark-mode')
    localStorage.setItem('theme-mode', 'dark-mode')
  })
  
  $('.clear-theme').click(() => {
    $('body').removeClass('dark-mode')
    localStorage.setItem('theme-mode', 'light-mode')
  })
  //Fin Alto contraste

  $(document).ready(function () {

    //Conservar clase alto contraste
    const themeMode = localStorage.getItem('theme-mode');

      if( themeMode === 'dark-mode' ){
        $('body').addClass(themeMode)
      } else {
        $('body').removeClass('dark-mode')
      }
    })

      //Fin Conservar clase alto contraste

})(jQuery, Drupal);

function initMap(options, data, allCitiesActive = false, mapInitial = false) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: options,
        zoom: 6
    });

    var contentHtml = function(obj) {
        //console.log(obj);
        return `<h4 data-key="${ obj.id }">${ obj.titulo }</h4>
                <p><span>Teléfono:</span>${ obj.telefono }</p>
                <p><span>Dirección:</span>${ obj.direccion }</p>
                <p><span>Horario de Atención:</span>${ obj.horario }</p>`;
    }

    var marker = new google.maps.Marker({
            position: options,
            title: 'Tu ubicacion'
        })
        //marker.setMap(map);

    var infowindow = new google.maps.InfoWindow();
    var markers = data.map((place) => {

        var image = {
            url: '/sites/all/themes/custom/credivalores/assets/icons/pin.png',
            //: new google.maps.Size(54,79)
          };

        return new google.maps.Marker({
            position: {
                lat: Number(place.latitud),
                lng: Number(place.longitud)
            },
            map: map,
            titulo: place.titulo,
            id: place.id,
            icon: image,
            direccion: place.direccion,
            telefono: place.telefono,
            horario: place.horario,
        })
    });

   
    markers.forEach(item => {
        if (item) {
            //console.log(item)
            let content = contentHtml(item);

            google.maps.event.addListener(item, 'click', (function(item, content, infowindow) {
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map, item);

                    google.maps.event.addListener(map, 'click', function() {
                        infowindow.close();
                    });

                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setIcon('/sites/all/themes/custom/credivalores/assets/icons/pin.png');
                    }

                    var icon = {
                        url: '/sites/all/themes/custom/credivalores/assets/icons/pin.png',
                        //scaledSize: new google.maps.Size(54,79)
                    }
                    item.setIcon(icon);
                    map.setCenter(this.getPosition());
                    map.setZoom(12);
                };

                console.log("clic")
            })(item, content, infowindow));
        }
    });
}

function markersMap(resp, allCitiesActive = false, mapInitial = false) {
    let dataResp = resp;

    let currentPos = {
        lat: parseFloat(dataResp[0].latitud),
        lng: parseFloat(dataResp[0].longitud)
    }
    //console.log("primero geolocalización",currentPos);
    initMap(currentPos, dataResp, allCitiesActive, mapInitial);
}


(function($, Drupal) {

    //funciones

    function getProductos(productos) {
        let i = 0;
        let options = '<option value="">Seleccionar</option>';
        let arrProducto = [];

        for (i; i < productos.length; i++) {
            if (arrProducto.indexOf(productos[i].producto) == -1) {
                arrProducto.push(productos[i].producto);
                options += `<option value="${ productos[i].producto }" data-lat="${ productos[i].latitud }" data-lng="${ productos[i].longitud }">${ productos[i].producto }</option>`;
            }
        }
        jQuery("#productos").html(options);
    }

    function getDepartamentos(departamento) {
        //console.log(departamento);
        let i = 0;
        let options = '<option value="">Seleccionar</option>';
        let arrDepartamento = [];

        for (i; i < departamento.length; i++) {
            if (arrDepartamento.indexOf(departamento[i].departamento) == -1) {
                arrDepartamento.push(departamento[i].departamento);
                console.log(departamento[i].departamento);
                options += `<option value="${ departamento[i].departamento }" data-lat="${ departamento[i].latitud }" data-lng="${ departamento[i].longitud }">${ departamento[i].departamento }</option>`;
            }
        }
        
        jQuery("#departamentos").html(options);
    }

    function getCiudades(ciudad) {
        //console.log(ciudad);
        let i = 0;
        let options = '<option value="">Seleccionar</option>';
        let arrCiudad = [];

        for (i; i < ciudad.length; i++) {
            if (arrCiudad.indexOf(ciudad[i].ciudad) == -1) {
                arrCiudad.push(ciudad[i].ciudad);
                console.log(ciudad[i].ciudad);
                options += `<option value="${ ciudad[i].ciudad }" data-lat="${ ciudad[i].latitud }" data-lng="${ ciudad[i].longitud }">${ ciudad[i].ciudad }</option>`;
            }
        }
        jQuery("#ciudades").html(options);
    }

    
    function renderPuntos(puntos){
        console.log(puntos);
        let i = 0;
        let options = 
        `<div class="col-12 col-lg-4">`+
        `<div class="container-fluid">`+
          `<div class="row mb-4">`+
            `<div class="col-4"><div class="icon-destination rounded-circle"></div></div>`+
            `<div class="col-8 d-flex align-items-center"><h3>${puntos[0].titulo}</h3></div>`+
          `</div>`+
        `</div>`+
      `</div>`;
        let arrPuntos = [];

        options += `<div class="col-12 col-lg-8 row">`
        for (i; i < puntos.length; i++) {
                arrPuntos.push(puntos[i].puntos);
                options +=
                `<div class="col-12 col-md-6 col-lg-4 mb-4 mb-md-0">`+
                    `<h4>${ puntos[i].titulo }</h4>`+
                    `<ul>`+
                        `<li><p class="d-inline"><span>Teléfono:</span></p><p class="font-weight-bold">${ puntos[i].telefono }</p></li>`+
                        `<li><p class="d-inline"><span>Dirección:</span></p><p class="font-weight-bold">${ puntos[i].direccion }</p></li>`+
                        `<li><p class="d-inline"><span>Horario de atención:</span></p><p class="font-weight-bold">${ puntos[i].horario }</p></li>`+
                    `</ul>`+
                `</div>`;
                //options += `<option value="${ puntos[i].puntos }" data-lat="${ puntos[i].latitud }" data-lng="${ puntos[i].longitud }">${ puntos[i].puntos }</option>`;
        }
        options += `</div>`
        console.log(options);
        jQuery(".puntos div.row").html(options);
    }

    function getOficinas() {

        $.getJSON("api/oficina?_format=json", (resp) => {
            let productos = resp;
            //console.log(productos);

            // Run functions
            getProductos(productos);
            markersMap(productos, true, true);
            
            // cambio de producto
            jQuery('#productos').change(function() {

                
                
                let producto = productos.filter(place => {
                    return place.producto == this.value;
                });

                //console.log(this.value);
                //console.log(producto);
                markersMap(producto);
                getDepartamentos(producto);
                //jQuery("#ciudades").empty();

            });

            //cambio de departamento
            jQuery('#departamentos').change(function() {

                let productoSelect = document.getElementById("productos");
                let productoSelectValue = productoSelect.options[productoSelect.selectedIndex].text;
                let departamentoSelect = document.getElementById("departamentos");
                let departamentoSelectValue = departamentoSelect.options[departamentoSelect.selectedIndex].text; 

                //console.log(productoSelectValue)
                //console.log(departamentoSelectValue)

                let departamento = productos.filter(place => {
                    return (place.producto == productoSelectValue) && (place.departamento == departamentoSelectValue)
                });
                //console.log(departamento)
                markersMap(departamento);
                getCiudades(departamento);

            });

            //cambio de ciudad
            jQuery('#ciudades').change(function() {

                let productoSelect = document.getElementById("productos");
                let productoSelectValue = productoSelect.options[productoSelect.selectedIndex].text;
                let departamentoSelect = document.getElementById("departamentos");
                let departamentoSelectValue = departamentoSelect.options[departamentoSelect.selectedIndex].text;            
                //console.log(productoSelectValue, departamentoSelectValue, this.value);
                let ciudad = productos.filter(place => {
                   return (place.producto == productoSelectValue) && (place.departamento == departamentoSelectValue) && (place.ciudad == this.value);
                });

                console.log(ciudad)

                markersMap(ciudad);
                //renderPuntos(ciudad);

            });



        });
    }
    getOficinas();

})(jQuery, Drupal);
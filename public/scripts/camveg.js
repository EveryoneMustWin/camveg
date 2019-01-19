

$().ready(function() {
    console.log("ready");

    var camveg = {
        consoleShown: true
    };

    camveg.toggleConsole = function() {

        console.log("toggleConsole");

        if (camveg.consoleShown) {

            console.log("hiding console");

            $("#map-container").animate({
                height: "500px"
            });

            camveg.consoleShown = false;
        } else {

            console.log("showing console");

            $("#map-container").animate({
                height: "400px"
            });

            camveg.consoleShown = true;
        }
    };

    var mymap = L.map('map-container').setView([52.2000, 0.1284], 14);


    camveg.load = function() {

        $.each(outlets, function(i, o) {

            console.log(o);

            L.marker([o.lat, o.lng]).addTo(mymap);
        });
    };


    var lnrs = [];

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 16,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);

    $("#new-user-submit").click(function() {

        var newUserName = $("#new-user-name input").val();
        var newUserEmail = $("#new-user-email input").val();

        console.log("the new user has details:");
        console.log(newUserName);
        console.log(newUserEmail);

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/newuser",
            data: {
                name: newUserEmail,
                email: newUserEmail
            }
        }).done(function(data, textStatus, jqXHR) {
            console.log(data);
        });
    });

    camveg.load();

    $(document).keydown(function(e) {

        console.log("keydown");
        console.log(e.keyCode);

        if (e.keyCode == 223) {

            camveg.toggleConsole();
        }
    });


});

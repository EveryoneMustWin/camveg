

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
                width: "1300px"
            });

            camveg.consoleShown = false;
        } else {

            console.log("showing console");

            $("#map-container").animate({
                width: "600px"
            });

            camveg.consoleShown = true;
        }
    };

    var mymap = L.map('map-container').setView([52.2000, 0.1284], 14);

    camveg.createGallery = function(photos) {

        if (photos == undefined || photos.length == 0) {
            return "<div></div>";
        }

        console.log("createGallery");

        galleryStr = "";

        $.each(photos, function(i, p) {

            console.log(p);

            galleryStr += ("<div class='photo-holder'><img src='images/" + p + "'></img></div><div class='photo-spacer'></div>");
        });

        galleryStr += "";

        console.log(galleryStr);

        return galleryStr;
    }


    camveg.load = function() {

        $.each(outlets, function (i, o) {
            console.log(o);
            $.each(o.venues, function (j, v) {

                var m = L.marker([v.location.lat, v.location.lng]).addTo(mymap);

                console.log(m);

                $(m).click(function () {

                    console.log("marker clicked");

                    mymap.panTo(m.getLatLng());

                    $("#debug").hide();

                    $("#map-container").animate({
                        width: "600px"
                    });

                    $("#about-header").empty().append(o.name);
                    $("#about-summary").empty().append(o.description);
                    $("#about-photos").empty().append(camveg.createGallery(o.photos));
                    $("#about-reviews").empty().append(o.reviews);
                });
            });
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

        if ((e.keyCode == 192) || (e.keyCode == 223)) {

            camveg.toggleConsole();
        }
    });
});

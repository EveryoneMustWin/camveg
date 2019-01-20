

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
                width: "1360px"
            });

            camveg.consoleShown = false;
        } else {

            console.log("showing console");

            $("#map-container").animate({
                width: "1128px"
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

    // Formats a date object as a string 'YYYY-MM-DD'
    camveg.formatDate = function (date)
    {
        return date.getFullYear().toString() + "-" +
               (date.getMonth() + 1).toString().padStart(2, '0') + "-" +
               (date.getDate()).toString().padStart(2, '0');
    }

    // Formats hours as hh:mm - hh:mm
    camveg.formatHours = function (hours) {
        return "<div class='hour-minute'>" + hours[0] + "</div>" +
               "<div class='hour-minute'>" + " - " + "</div>" +
               "<div class='hour-minute'>" + hours[1] + "</div>";
    }

    camveg.createOpeningHours = function (hoursOpen, hoursClosed) {
        console.log("createOpeningHours");

        hoursClosed = (hoursClosed == null) ? {} : hoursClosed;

        var dateToday = new Date();
        console.log(dateToday);
        
        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var openingHours = "<b>Open:</b><br><div class='opening-hours-summary'>";
        // Format weekday opening hours as table
        const NumDaysInWeek = 7;
        datesAdded = []
        // Show dates up to ~1 month ahead, and maximum of 7 dates in total
        for (var i = 0; i < 30 && datesAdded.length < NumDaysInWeek; i++) {
            date = new Date();
            date.setDate(dateToday.getDate() + i);
            
            var dayOfWeek = dayNames[date.getDay()];
            var yearMonthDate = camveg.formatDate(date);

            line = "<div class='opening-hours-day'>";
            line += "<div class='weekday'>" + dayOfWeek + "</div>";
            line += "<div class='weekday'>" + date.getDate() + "</div>";
            line += "<div class='weekday'>" + monthNames[date.getMonth()] + "</div>";
            // Check for day of week - unless date found in closing hours
            if (dayOfWeek in hoursOpen && !(yearMonthDate in hoursClosed)) {
                line += camveg.formatHours(hoursOpen[dayOfWeek]);
                datesAdded.push(yearMonthDate);
            }
            // Otherwise, check specific date
            else if (yearMonthDate in hoursOpen) {
                line += camveg.formatHours(hoursOpen[yearMonthDate]);
                datesAdded.push(yearMonthDate);
            }
            // If not, it's closed
            else {
                line += "<div class='hour-minute'>" + "Closed" + "</div>";
            }
            line += "</div>";
            openingHours += line;
        }

        openingHours += "</div>";

        return openingHours;
    }

    camveg.createRating = function(score) {

        var s = parseInt(score);

        console.log("score is " + s);

        var scoreHtml = "<div class='place-score'>";

        var i = 0;

        while (i < s) {

            scoreHtml += "<img src='images/star.png'></img>";
            i++;
        }

        scoreHtml += "</div>";

        return scoreHtml;
    }


    camveg.load = function() {

        $.each(outlets, function (i, o) {
            $.each(o.venues, function (j, v) {

                var m = L.marker([v.location.lat, v.location.lng]).addTo(mymap);

                //console.log(m);

                $(m).click(function () {

                    console.log("marker clicked");

                    mymap.panTo(m.getLatLng());

                    $("#debug").hide();

                    $("#map-container").animate({
                        width: "1128px"
                    });

                    $("#about-header").empty().append(o.name);
                    $("#about-summary").empty().append(o.description);
                    $("#about-photos").empty().append(camveg.createGallery(o.photos));
                    $("#about-facilities").empty().append(o.facilities.join(", "));
                    $("#about-hours").empty().append(camveg.createOpeningHours(v.open, v.closed));
                    $("#about-reviews").empty().append(camveg.createRating(o.rating));
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

    // $("#new-user-submit").click(function() {

    //     var newUserName = $("#new-user-name input").val();
    //     var newUserEmail = $("#new-user-email input").val();

    //     console.log("the new user has details:");
    //     console.log(newUserName);
    //     console.log(newUserEmail);

    //     $.ajax({
    //         type: "POST",
    //         url: "http://localhost:3000/newuser",
    //         data: {
    //             name: newUserName,
    //             email: newUserEmail
    //         }
    //     }).done(function(data, textStatus, jqXHR) {
    //         console.log(data);
    //     });
    // });

    // $("#user-check-submit").click(function() {

    //     var checkUserEmail = $("#user-check-email input").val();

    //     console.log("the user has details:");
    //     console.log(checkUserEmail);

    //     $.ajax({
    //         type: "POST",
    //         url: "http://localhost:3000/user",
    //         data: {
    //             email: checkUserEmail
    //         }
    //     }).done(function(data, textStatus, jqXHR) {
    //         console.log(data);
    //     });
    // });

    $("#place-new-submit").click(function() {

        var newPlaceID = $("#place-new-id input").val();
        var newPlaceName = $("#place-new-name input").val();
        var newPlaceLat = $("#place-new-lat input").val();
        var newPlaceLng = $("#place-new-lng input").val();

        console.log("the new user has details:");
        console.log(newPlaceID);
        console.log(newPlaceName);
        console.log(newPlaceLat);
        console.log(newPlaceLng);

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/newplace",
            data: {
                id: newPlaceID,
                name: newPlaceName,
                lat: newPlaceLat,
                lng: newPlaceLng
            }
        }).done(function(data, textStatus, jqXHR) {
            console.log(data);
        });
    });

    $("#place-check-submit").click(function() {

        var checkPlaceID = $("#place-check-id input").val();

        console.log("the place is:");
        console.log(checkPlaceID);

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/place",
            data: {
                id: checkPlaceID
            }
        }).done(function(data, textStatus, jqXHR) {
            console.log(data);
        });
    });

    camveg.load();

    $(document).keydown(function(e) {

        //console.log(e.keyCode);

        //if ((e.keyCode == 192) || (e.keyCode == 223)) {
        if (e.keyCode == 223) {

            camveg.toggleConsole();
        }
    });
});

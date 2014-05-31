var socket = io.connect('http://'+location.host+'/', {
    "force new connection": true,
    "transports": ["xhr-polling"]
});

var map = initialize();

socket.on('tweet', function(data) {
    putMarker(map, data);
    showDetail(data);
});

function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(35.642812, 139.671529),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map($('#map_canvas').get(0),
        mapOptions);
    return map;
}

function putMarker(map, data) {
    if (data.geo != null) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1]),
            map: map,
            icon: new google.maps.MarkerImage(
                data.user.profile_image_url,  // url of img
                new google.maps.Size(48, 48), // size
                new google.maps.Point(0, 0),  // origin
                new google.maps.Point(16, 16) // anchor
            )
        });
        setTimeout(function() {
            marker.setMap(null);
        }, 1000 * 30);
    }
}

function showDetail(data) {
    $('#tweets').prepend(
        '<div class="tweet" style="display: none;">' +
            '<p>' +
                '<img src="' + data.user.profile_image_url + '">' +
                '<b>' + data.user.name + '</b>' +
                '<a href="https://twitter.com/' + data.user.screen_name + '" target="_blank">' +
                    ' @' + data.user.screen_name +
                '</a>' +
            '</p>' +
            '<p>' + data.text + '</p>' +
        '</div>'
    );
}

$('.btn-readmore').click(function() {
    $('.tweet').fadeIn(1000);
});

$(document).ready(function() {
	//the dropdown menu
	$('.ui.dropdown')
	.dropdown({
		on:'hover'
	});

	$('.ui.selection.dropdown')
  	.dropdown();

    $('.field .ui.image')
        .dimmer({on: 'hover'})
		.dimmer('setting','duration',{
            show: 1,
            hide: 100
        });

	Gmap();
	function Gmap() {
		var centerMarker = null;
		var center = new google.maps.LatLng(-6.2013405,106.8498631);
		var initOptions = {
			zoom: 11,
			center: center,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById("locmap"), initOptions);

		//set traffic map
		var trafficLayer = new google.maps.TrafficLayer();
    	trafficLayer.setMap(map);

		google.maps.event.addListener(map, "click", function(event) {
			if(centerMarker == null)
			{
				centerMarker = new google.maps.Marker( {position:new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()), draggable:true, map:map} );
				google.maps.event.addListener(centerMarker, "dragend", function(event) {
					var centerMarkerPos = centerMarker.getPosition();
					$("#device_lng").val(centerMarkerPos.lng());
					$("#device_lat").val(centerMarkerPos.lat());
				});
			}
			else
			{
				centerMarker.setPosition(new google.maps.LatLng(event.latLng.lat(),event.latLng.lng()));
			}
			$("#device_lng").val(event.latLng.lng());
			$("#device_lat").val(event.latLng.lat());
		});

		if($(".locmap").attr('edit_device') == "true")
		{
			centerMarker = new google.maps.Marker( {position:new google.maps.LatLng($("#device_lat").val(), $("#device_lng").val()), draggable:true, map:map} );
			google.maps.event.addListener(centerMarker, "dragend", function(event) {
				var centerMarkerPos = centerMarker.getPosition();
				$("#device_lng").val(centerMarkerPos.lng());
				$("#device_lat").val(centerMarkerPos.lat());
			});
		}
	}

});

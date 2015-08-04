"use strict";

var ready = function (object, callback) {
		if (object == null || typeof(object) == 'undefined') return;
		if (object.readyState != 'loading'){
			callback();
		} else if (object.addEventListener) {
			object.addEventListener('DOMContentLoaded', callback);
		} else {
			object.attachEvent('onreadystatechange', function() {
				if (object.readyState != 'loading')
					callback();
			});
		}
	},
	addEvent = function(object, type, callback) {
		if (object == null || typeof(object) == 'undefined') return;
		if (object.addEventListener) {
			object.addEventListener(type, callback, false);
		} else if (object.attachEvent) {
			object.attachEvent("on" + type, callback);
		} else {
			object["on"+type] = callback;
		}
	},
	responsiveBackground = function () {
		var elements = document.querySelectorAll("[data-background]");

		// Loop for every available element
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i],
				windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
				backgroundResponsiveMatched = false,
				backgroundResponsiveShorted = [];

			// Check the avilable matched rules
			if (element.backgroundResponsiveShorted == null) {
				for (var j = 0; j < element.attributes.length; j++) {
					var attribute = element.attributes[j];

					if (attribute.name.indexOf("data-background-") === 0) {
						var responsiveWidth = parseInt(attribute.name.split("data-background-")[1]);

						backgroundResponsiveShorted.push([responsiveWidth, attribute.value]);
					}
				}

				// Sort the attributes
				backgroundResponsiveShorted.sort(function (a, b) {
					return b[0]-a[0];
				});

				// Assign it to
				element.backgroundResponsiveShorted = backgroundResponsiveShorted;
			}

			// Apply the matched rules
			for (var j = 0; j < element.backgroundResponsiveShorted.length; j++) {
				if (windowWidth <= element.backgroundResponsiveShorted[j][0]) {
					element.style.background = element.backgroundResponsiveShorted[j][1];
					backgroundResponsiveMatched = true;
				}
			}

			// If no matching rules, use default one
			if (!backgroundResponsiveMatched) {
				element.style.background = element.attributes["data-background"].value;
			}
		}
	};

// Run it on the beginning
ready(document, function () {
	responsiveBackground ();
});

// Run it when the window get resized
addEvent (window, "resize", function() {
	responsiveBackground ();
});

// Parallax Background
ready(document, function () {
	var element = document.getElementById("doEvent"),
		oldInnerHTML = element.innerHTML;

	element.innerHTML = "<div></div>";
	element.childNodes[0].innerHTML = oldInnerHTML;

	for (var i = 0; i < element.style.length; i++) {
		element.childNodes[0].style[element.style[i]] = element.style[element.style[i]];
	}

	element.style.overflow = "hidden";
	element.style.position = "relative";

	element.childNodes[0].style.position = "absolute";
	element.childNodes[0].style.top = -32;
	element.childNodes[0].style.left = -32;
	element.childNodes[0].style.width = element.offsetWidth + 64;
	element.childNodes[0].style.height = element.offsetHeight + 64;
	element.childNodes[0].style.backgroundSize = "cover";
	element.childNodes[0].style.backgroundPosition = "center center";
	element.childNodes[0].style.transition = "left 0.128s linear, top 0.128s linear";

	console.log (element.childNodes[0]);

	if (window.DeviceOrientationEvent) {
		// Listen for the deviceorientation event and handle the raw data
		window.addEventListener('deviceorientation', function(eventData) {
			// alpha is the compass direction the device is facing in degrees
			var dir = Math.round(eventData.alpha);

			if (dir > 180) {
				// gamma is the left-to-right tilt in degrees, where right is positive
				var tiltLR = eventData.gamma;
				tiltLR = Math.round((tiltLR / 90) * 64);
				if (tiltLR > 32) tiltLR = 32;
				if (tiltLR < -32) tiltLR = -32;

				// beta is the front-to-back tilt in degrees, where front is positive
				var tiltFB = eventData.beta;
				tiltFB = Math.round(((tiltFB - 45) / 90) * 32);
				if (tiltFB > 32) tiltFB = 32;
				if (tiltFB < -32) tiltFB = -32;

				// call our orientation event handler
				document.getElementById("sniff").innerHTML = tiltLR + ", " + tiltFB + ", " + dir;

				element.childNodes[0].style.top =  0 - 32 - tiltFB;
				element.childNodes[0].style.left = 0 - 32 - tiltLR;
			}
		}, false);
	} else {
		document.getElementById("sniff").innerHTML = "Not supported."
	}
});
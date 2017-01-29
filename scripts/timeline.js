// Large size - convert rgba(#,#,#,#) format to hex color value
// source: http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
function rgb_to_hex(rgb){
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


// Large size - utility function to modify hex colors to be lighter or darker in JavaScript layer,
// use in conjunction with rgb_to_hex() above
// source: https://css-tricks.com/snippets/javascript/lighten-darken-color/
function modify_color(col, amt) {
	var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}


// Large Size - used here as rate limiting for scroll listener event
// source: http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


// Small Size - receive clicked team li, toggle .active class if "tap to expand" message is visible
function expand_team_li(team) {
	if($("#tap").is(":visible")) {
		$(team).toggleClass("active");
	}
}


// Small size, Medium size - remove class .current from all .table-list,
// re-apply to .table-list having data-year that matches <select> value
function change_display_year(year) {
	$(".table-list").removeClass("current");
	$(".table-list[data-year=" + year + "]").addClass("current");
}


// Large size - searches class string for conference and returns string
function get_conference(clicked) {
	var conference = "";
	var search = ["eastern", "western", "central"];

	for (i = 0; i < search.length; i++) {
		if(clicked.indexOf(search[i]) != -1) {
			conference = search[i];

			break;
		}
	}

	return conference;
}


// Large size - receive current <li> and next <li>, determine properties to apply and return object for jsPlumb
// get background-color attribute from the two <li>s to generate a gradient for the connector
function get_connecting_line(current, next) {
	var line_properties = {
		anchors: ["BottomCenter", "TopCenter"],
		endpoints: ["Blank", "Blank"],
		paintStyle: {
			gradient: {
				stops:[[0, current.css("background-color")],[1, next.css("background-color")]]
			},
			lineWidth: 6,
			strokeStyle: next.css("background-color")
		}
	}

	// use a staight line connector if the two <li>s are directly above one other, less curviness if there is a difference of 1
	var difference = Math.abs($(current).siblings(":visible").addBack().index(current) - $(next).siblings(":visible").addBack().index(next));

	switch(difference) {
		case 0:
			line_properties.connector = ["Straight"];
			break;

		case 1:
			line_properties.connector = [ "Bezier", { curviness: 15 } ];
			break;

		default:
			line_properties.connector = [ "Bezier", { curviness: 30 } ];
	}

	// return line properties object
	return line_properties;
}


// Large size - get ordinal of table position integer
// source: http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function get_ordinal(number) {
    var j = number % 10,
    k = number % 100;
    if (j == 1 && k != 11) {
        return number + "st";
    }
    if (j == 2 && k != 12) {
        return number + "nd";
    }
    if (j == 3 && k != 13) {
        return number + "rd";
    }
    return number + "th";
}

// Large size - adds "Playoffs, " to expanded statistics string if team li has playoffs class
function get_playoffs(clicked) {

	var playoffs = "";

	if($(clicked).attr('class').indexOf("playoffs") > -1) {
		playoffs += "Playoffs, ";
	}

	return playoffs;
}


// Large size - returns string with team's position in table and position in conference for a given year
function get_position(clicked) {
	var team = get_team($(clicked).attr('class'));
	var position_string = "";

	position_string = get_playoffs(clicked);

	var conference = get_conference($(clicked).attr('class'));
	var position_in_table = $(clicked).index() + 1;
	var position_in_conference = $(clicked).siblings("." + conference).addBack().index(clicked) + 1;

	position_string += get_ordinal(position_in_table) + " overall, ";
	position_string += get_ordinal(position_in_conference) + " " + (conference.charAt(0).toUpperCase() + conference.slice(1));

	return position_string;
}


// Large size - receive "clicked" (applied classes as a string) and split into array before removing non-team name classes
function get_team(clicked) {
	var class_array = clicked.split(" ");
	var remove = ['eastern', 'western', 'central', '_jsPlumb_endpoint_anchor', '_jsPlumb_connected', 'connected'];
	var index = [];

	// find index of extraneous classes
	for (i = 0; i < remove.length; i++) {
		if(class_array.indexOf(remove[i]) >= 0) {
			index.push(class_array.indexOf(remove[i]));
		}
	}

	// splice classes from array
	for(i = 0; i < index.length; i++) {
		class_array.splice(index[i], 1);
	}

	// return team name class string
	return class_array[0];
}


// Large size - receive class attribute of team name <span> and build a string of any trophies found, return string
function get_trophies(clicked) {
	var trophies = "";

	if(clicked) {

		if(clicked.search("mls-cup") !== -1) { trophies += ""; }
		if(clicked.search("supporters-shield") !== -1) { trophies += ""; }
		if(clicked.search("open-cup") !== -1) { trophies += ""; }
		if(clicked.search("voyageurs-cup") !== -1) { trophies += ""; }
	}

	return trophies;
}


// Large size - receive team's name and connect .table-list li tags with that class
function connect(team) {
	for(i = 0; i < $('.table-list').length-1; i++)
	{
		// assign current and next <li> to variables
		var current = $('.table-list').eq(i).children('li:visible.' + team);
		var next = $('.table-list').eq(i+1).children('li:visible.' + team);

		if(current.length != 0 && next.length != 0)
		{
			// connect the team's <li> in the current row with the <li> in the next row
			jsPlumb.connect({ source: current, target: next }, get_connecting_line(current, next));
		}
	}

	connected = true;
	$('.table-list > li.' + team).addClass('connected');
	$('.table-list > li:not(.' + team + ')').addClass('grey');
}


// Large size - builds & returns object "e" with the properties & attributes from the clicked <li>
function get_expanded(clicked) {
	var e = new Object();

	e.team = $(clicked).children('span').text();
	e.year = $(clicked).parent().attr('data-year');
	e.trophies = get_trophies($(clicked).children('span').attr('class'));
	e.position = get_position(clicked);
	e.css_class = get_team($(clicked).attr('class'));
	e.background_color = $(clicked).css('background-color');
	e.text_color = $(clicked).css('color');
	e.text_shadow = $(clicked).css('text-shadow');
	e.border_color = modify_color(rgb_to_hex(e.background_color), -15);
	e.background_image = window.getComputedStyle(document.querySelector('.table-list[data-year="' + e.year + '"] li.' + e.css_class), ':after').getPropertyValue('background-image');
	e.stats = {
		points: $(clicked).find('.p').text(),
		gd: 	$(clicked).find('.gd').text(),
		win: 	$(clicked).find('.w').text(),
		loss: 	$(clicked).find('.l').text(),
		draw: 	$(clicked).find('.d').length > 0 ? $(clicked).find('.d').text() : null
	};

	return e;
}


// Large size - fill fields in #expanded-statistics <div> using data from the information from the clicked <li>
// use object "expanded"
function set_expanded(clicked) {
	var expanded = get_expanded(clicked);

	$('#expanded-team').text(expanded.team);
	$('#expanded-year').text(expanded.year);
	$('#expanded-trophies').text(expanded.trophies);
	$('#expanded-position').text(expanded.position);

	$('#expanded-stat-line li.p').contents().filter(function() { return this.nodeType == 3;	})[0].nodeValue = expanded.stats.points;
	$('#expanded-stat-line li.gd').contents().filter(function() { return this.nodeType == 3;	})[0].nodeValue = expanded.stats.gd;
	$('#expanded-stat-line li.w').contents().filter(function() { return this.nodeType == 3;	})[0].nodeValue = expanded.stats.win;
	$('#expanded-stat-line li.l').contents().filter(function() { return this.nodeType == 3;	})[0].nodeValue = expanded.stats.loss;

	if(expanded.stats.draw) {
		$('#expanded-stat-line li.d').removeClass('hidden');
		$('#expanded-stat-line li.d').contents().filter(function() { return this.nodeType == 3;	})[0].nodeValue = expanded.stats.draw;
	} else {
		$('#expanded-stat-line li.d').addClass('hidden');
	}

	// visual styling changes
	$('#expanded-statistics #expanded-logo').css({'background-image': expanded.background_image});
	$('#expanded-statistics').css({
		'color': expanded.text_color,
		'background-color': expanded.background_color,
		'text-shadow': expanded.text_shadow + ', ' + expanded.text_shadow.replace('1px 1px', '2px 2px') + ', ' + expanded.text_shadow.replace('1px 1px', '3px 3px'),
		'border-top': '2px solid ' + expanded.border_color
	});

	//expanded stat line <div> has different behavior if the clicked item's text is not white
	if(expanded.text_color === "rgb(255, 255, 255)") {
		$('#expanded-stat-line').css({ 'text-shadow' : expanded.text_shadow	});
		$('#expanded-stat-line li').css({ 'background-color' : modify_color(rgb_to_hex(expanded.background_color), 20) });
		$('#expanded-stat-line span').css({
			'background-color' : modify_color(rgb_to_hex(expanded.background_color), -40),
			'border-bottom-color' : expanded.background_color
		});
	} else {
		$('#expanded-stat-line').css({
			'color' : "#FFFFFF",
			'text-shadow' : "rgb(51, 51, 51) 1px 1px 0px"
		});
		$('#expanded-stat-line li').css({ 'background-color' : modify_color(rgb_to_hex(expanded.text_color), 40) });
		$('#expanded-stat-line span').css({
			'background-color' : expanded.text_color,
			'border-bottom-color' : expanded.background_color
		});
	}

	// set attributes for .zoom <div> used for expanded team/year
	var zoom_attributes = { "text_color" : expanded.text_color, "text_shadow" : expanded.text_shadow, "background_color" : expanded.background_color, "transition_color" : expanded.border_color};

	set_zoom(clicked, zoom_attributes);

	//http://stackoverflow.com/questions/3442394/jquery-using-text-to-retrieve-only-text-not-nested-in-child-tags
}


// Large size - set attributes for zoom icon and background color animation
// .zoom div is removed via the reset_zoom function
// width and height assigned with ceil() function to account for browser subpixel rendering of vw measurements
function set_zoom(clicked, attributes) {	
	$(clicked).prepend('<div class="zoom"></div>');
	$('.zoom').css({
		'color' : attributes['text_color'],
		'background-color' : attributes['background_color'],
		'text-shadow' : attributes['text_shadow'] + ', ' + attributes['text_shadow'].replace('1px 1px', '2px 2px') + ', ' + attributes['text_shadow'].replace('1px 1px', '3px 3px')
	});
}


// Large size - receive the value of the selected radio button and apply class .hidden to rows/<li>s being hidden
function filter_table(search) {
	var impacted = $('#table-position ol > li, .table-list > li, .table-list');

	if(search !== 'all') {
		reset_all();
		$(impacted).removeClass('hidden');
		$('.table-list > li:not(.'+ search +')').addClass('hidden');
		filter_labels(search);
	} else {
		reset_all();
		$(impacted).removeClass('hidden');
	}
}


// Large size - receives the search value, finds the maximum number of occurances and hides the extra <li>s in #table-position,
// hides rows without search class entry
function filter_labels(search) {
	var rows = $('.table-list');
	var lengths = [];

	rows.each(function() {
		lengths[lengths.length] = $(this).children('.' + search).length;
	});

	var max = Math.max.apply(Math, lengths);

	$('#table-position li').slice(max, rows.length).addClass('hidden');
	$('.table-list').not(":has('li." + search +"')").addClass('hidden');
}


// Large size - highest level reset - removes all jsPlumb elements, hides expanded statistics
function reset_all() {
	reset_jsplumb();
	$('#expanded-statistics').removeClass('visible');
	$('#expanded-statistics').css('border-top-color', '#595959');
}


// Large size - remove jsPlumb connections, restore other squares to normal state
function reset_jsplumb() {
	connected = false;
	jsPlumb.reset();

	// remove any previous "jsPlumb_" id attributes
	$('.table-list > li').removeAttr("id");

	// remove connected and grey classes from table-list <li>s
	$('.table-list li').removeClass('connected grey');

	reset_zoom();
}


// Large size - remove ".zoom" div -- jsPlumb connections are not modified
function reset_zoom() {
	$('.zoom').remove();
}


// Small size - expand team <li> to show additional stats
$(".table-list > li").click(function() {
	expand_team_li(this);
});


// Small size - display a different year
$("#year").change(function() {
	change_display_year($(this).val());
});


// Large size - Connect team's entry in each .table-list row and display expanded statistics for selected year
$('.table-list li').click(function() {
	if($("#year").is(":hidden")) {

		if($(this).children('.zoom').length) {
			// reset any existing jsplumb connections and connect the selected team
			reset_all();
		} else {
			// update expanded statistics, connect new team if necessary
			reset_zoom();

			var team_name = get_team($(this).attr('class'));

			if(!$(this).hasClass('connected')) {
				reset_jsplumb();

				jsPlumb.setSuspendDrawing(true);
				connect(team_name);
				
				setTimeout(function() {
					jsPlumb.setSuspendDrawing(false, true);
				}, 50);
			}

			set_expanded(this);

			if(!$('#expanded-statistics').hasClass('visible')) {
				$('#expanded-statistics').addClass('visible');
			}

		}
	}
});


// Declare "connected" boolean variable for use with jsPlum evaluation
window.connected = false;


// Large size - filter displayed content based on radio button clicked
$('#filter input').click(function() {
	filter_table($(this).attr("value"));
});


// Large size - Add behavior to expanded statistics close button
$('#close a').click(function() {
	reset_all();
	return false;
});


// Scroll Listener - Large size - add "fixed" class to "#table-position" when screen scrolls below
// source: https://css-tricks.com/scroll-fix-content/
var table_position = $("#table-position");
var div_bottom = table_position.offset().top + table_position.height();
$(document).scroll(
	debounce(function() {
	if($(document).scrollTop() > div_bottom) {
		$('#filter').css({'margin-bottom' : table_position[0].getBoundingClientRect().height});
		table_position.addClass("fixed");
	} else {
		$('#filter').css({'margin-bottom' : '0'});
		table_position.removeClass("fixed");
	}
}, 50));


// Resize Listener - if connected state is true, reset jsPlumb and expanded statistics
$(window).resize(
	debounce(function() {
		if(connected) {
			reset_all();
		}

		if($("#tap").is(":hidden")) {
			$('.table-list > li').removeClass("active");
		}
}, 75, true));


// Large size - Firefox only - trigger jsPlumb connection on page load and reset to prevent connector alignment issue
$(document).ready(function() {
	if(navigator.userAgent.match('Firefox')) {
		jsPlumb.ready(function() {
			jsPlumb.connect({source:"legend", target:"filter"}); jsPlumb.reset();
		});
	}
});


// http://bricss.net/post/22198838298/easily-checking-in-javascript-if-a-css-media-query
// http://www.sitepoint.com/javascript-generate-lighter-darker-color/
// https://css-tricks.com/snippets/javascript/lighten-darken-color/
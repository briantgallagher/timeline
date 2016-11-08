<?php
	$latest_year = 2016;
?>

<!DOCTYPE html>

<html>
	<head>
		<title>Timeline: MLS 1996 - <?php echo $latest_year; ?></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="keywords" content="" />
		<meta name="description" content="" />
		<meta charset="UTF-8">

		<link href='http://fonts.googleapis.com/css?family=Titillium+Web:400,700' rel='stylesheet' type='text/css'>

		<link rel="stylesheet" href="css/base.css" />
	</head>
	
	<body>
		<div id="container">
			<section id="category-names">
				<div id="year-select">
					<select id="year">
						<?php for($y = $latest_year; $y >= 1996; $y--): ?>
						<option><?php echo $y; ?></option>
						<?php endfor; ?>
					</select>
				</div>
				<ul>
					<li class="p">Pts</li>
					<li class="gd">GD</li>
					<li class="w">W</li>
					<li class="l">L</li>
					<li class="d">D</li>
				</ul>
			</section>

			<p id="tap">(tap to show additional statistics)</p>

			<section id="legend">
				<p>
					<span class="mls-cup">MLS Cup</span>
					<span class="supporters-shield">Supporters' Shield</span>
					<span class="open-cup">U.S. Open Cup</span>
					<span class="voyageurs-cup">Voyageurs Cup</span>
				</p>
			</section>

			<section id="filter">
				<p><b>Filter:</b>
					<span><input type="radio" id="all" value="all" name="filter" checked="checked" /><label for="all">All</label></span>
					<span><input type="radio" id="eastern" value="eastern" name="filter" /><label for="eastern">Eastern</label></span>
					<span><input type="radio" id="central" value="central" name="filter" /><label for="central">Central</label></span>
					<span><input type="radio" id="western" value="western" name="filter" /><label for="western">Western</label></span>
				</p>
			</section>

			<section id="table-position">
				<ol>
					<?php for($p = 1; $p <= 20; $p++): ?>
					<li><?php echo $p; ?></li>
					<?php endfor; ?>
				</ol>
			</section>

			<section id="table-listing">
				<?php for($y = $latest_year; $y >= 1996; $y--): ?>
				<?php include('includes/' . $y . '.php'); ?>
				<?php endfor; ?>
			</section>

			<section id="notes-acknowledgements">
				<div>
					<div id="notes">
						<h3>Notes:</h3>
						<p>For the purposes of this timeline, a team's history is traced by its competitive record &dash; teams that have changed names or rebranded are connected.  The San Jose Clash/Earthquakes franchise was <a href="https://en.wikipedia.org/wiki/San_Jose_Earthquakes#Hiatus_and_return_.282006.E2.80.932008.29" class="blank">placed on hiatus</a> and resurrected later under the same name.  In this instance, the Houston Dynamo were considered an expansion team, despite the players and coaching staff from San Jose relocating.</p>
						<p>From the 1996 season through 1999, the league featured shootouts.  The resulting wins and losses are noted in parenthesis after the team's regulation win and loss statistics.  <a href="https://en.wikipedia.org/wiki/Supporters'_Shield#endnote_Points" class="blank">Points were awarded</a> as 3 points for a regulation win, 1 point for a shootout win.</p>
						<p>While <a href="http://www.mlssoccer.com/post/2015/10/22/internet-message-board-valued-prize-how-supporters-shield-got-its-start">the Supporters' Shield</a> trophy was first awared in 1998, the regular season points leaders from 1996 and 1997 are included in the engraving.</p>
						<p>The badge used on the team's primary jersey dictates what is displayed on a given year in the timeline.</p>
					</div>

					<div id="acknowledgements">
						<h3>Acknowledgements:</h3>
						<p>During the course of building this timeline, several sites proved to be invaluable resources.  My sincere thanks are extended to <a href="http://www.sportslogos.net/teams/list_by_league/9/Major_League_Soccer/MLS/logos/" class="blank">SportsLogos.net</a>, <a href="http://www.colorwerx.net/team-colors/soccer/major-league-soccer-1996-through-present/" class="blank">Colorwerx</a>, <a href="http://www.mlsarchives.com/">MLS Archives</a> and <a href="http://homepages.sover.net/~spectrum/" class="blank">The American Soccer History Archives</a>.  Without these references, this project would have been much more difficult or much less complete.</p>
					</div>
				</div>
			</section>

			<section id="expanded-statistics">
				<div>
					<div id="expanded-logo"></div>
					<p id="expanded-year"></p>
					<p id="expanded-team-trophies"><span id="expanded-team"></span> <span id="expanded-trophies"></span></p>
					<p id="expanded-position"></p>
					<div id="expanded-stat-line">
						<ul>
							<li class="p"><span>Pts</span> </li>
							<li class="gd"><span>GD</span> </li>
							<li class="w"><span>W</span> </li>
							<li class="l"><span>L</span> </li>
							<li class="d"><span>D</span> </li>
						</ul>
					</div>
					<div id="close"><a href="#">&#xe605;</a></div>
				</div>
			</section>

		</div>

		<footer id="footer">
			<div>
				<p>Timeline design, code &amp; concept &copy;2015<?php if(date('Y') !== "2015"): ?>&mdash;<?php echo date('Y'); ?><?php endif; ?></p>
			</div>
		</footer>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/dom.jsPlumb-1.7.8-min.js"></script>
		<script type="text/javascript" src="scripts/timeline.js"></script>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-71249747-1', 'auto');
		  ga('send', 'pageview');

		</script>
	</body>
</html>
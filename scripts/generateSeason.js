/**
 * To generate data for a season, update the "year" and "input" variables at the top of this script,
 * then execute by running "node generateSeason.js".  The new or updated season file will be alongside
 * the rest in the /includes folder.
 * 
 * Variables
 *     year: year of the MLS season
 *     input: copy the table data from the Wikipedia template for the MLS season results: https://en.wikipedia.org/w/index.php?title=Template:2019_Major_League_Soccer_season_table&action=edit
 * 
 *     Note: the Wikipedia is missing data on the Open Cup and has incomplete data on the Voyageurs Cup, so you may need to update the output manually to add those annotations.
 */

const year = "2019";

const input = `
|win_ATL=18 |draw_ATL=4 |loss_ATL=12 |gf_ATL=58 |ga_ATL=43  |status_ATL=U <!-- Atlanta United -->
|win_CHI=10 |draw_CHI=12 |loss_CHI=12 |gf_CHI=55 |ga_CHI=47  <!-- Chicago Fire -->
|win_CIN=6 |draw_CIN=6 |loss_CIN=22 |gf_CIN=31 |ga_CIN=75  <!-- FC Cincinnati -->
|win_CLB=10 |draw_CLB=8 |loss_CLB=16 |gf_CLB=39 |ga_CLB=47  <!-- Columbus Crew -->
|win_COL=12 |draw_COL=6 |loss_COL=16 |gf_COL=58 |ga_COL=63 <!-- Colorado Rapids -->
|win_DAL=13 |draw_DAL=9 |loss_DAL=12 |gf_DAL=54 |ga_DAL=46  <!-- FC Dallas -->
|win_DCU=13 |draw_DCU=11 |loss_DCU=10 |gf_DCU=42  |ga_DCU=38 <!-- DC United -->
|win_HOU=12 |draw_HOU=4 |loss_HOU=18 |gf_HOU=49 |ga_HOU=59  <!-- Houston Dynamo -->
|win_LAX=16 |draw_LAX=3 |loss_LAX=15 |gf_LAX=58 |ga_LAX=59  <!-- LA Galaxy -->
|win_LFC=21 |draw_LFC=9 |loss_LFC=4 |gf_LFC=85 |ga_LFC=37 |status_LFC=S <!-- Los Angeles FC -->
|win_MIN=15 |draw_MIN=8 |loss_MIN=11 |gf_MIN=52 |ga_MIN=43  <!-- Minnesota United -->
|win_MON=12 |draw_MON=5 |loss_MON=17 |gf_MON=47 |ga_MON=60 |status_MON=V <!-- Montreal Impact -->
|win_NEW=11 |draw_NEW=12 |loss_NEW=11 |gf_NEW=50 |ga_NEW=57 <!-- New England Revolution -->
|win_NYC=18 |draw_NYC=10 |loss_NYC=6 |gf_NYC=63 |ga_NYC=42  |status_NYC= <!-- New York City FC -->
|win_NYR=14 |draw_NYR=6 |loss_NYR=14 |gf_NYR=53 |ga_NYR=51  <!-- New York Red Bulls -->
|win_ORL=9 |draw_ORL=10 |loss_ORL=15 |gf_ORL=44 |ga_ORL=52 <!-- Orlando City -->
|win_PHI=16 |draw_PHI=7 |loss_PHI=11 |gf_PHI=58 |ga_PHI=50  <!-- Philadelphia Union -->
|win_POR=14 |draw_POR=7 |loss_POR=13 |gf_POR=52 |ga_POR=49 <!-- Portland Timbers -->
|win_RSL=16 |draw_RSL=5 |loss_RSL=13 |gf_RSL=46 |ga_RSL=41 <!-- Real Salt Lake -->
|win_SJO=13 |draw_SJO=5 |loss_SJO=16 |gf_SJO=52 |ga_SJO=55 <!-- San Jose Earthquakes -->
|win_SEA=16 |draw_SEA=8 |loss_SEA=10 |gf_SEA=52 |ga_SEA=49  |status_SEA=C<!-- Seattle Sounders -->
|win_SKC=10 |draw_SKC=8 |loss_SKC=16 |gf_SKC=49 |ga_SKC=67  <!-- Sporting Kansas City -->
|win_TOR=13 |draw_TOR=11 |loss_TOR=10 |gf_TOR=57 |ga_TOR=52  <!-- Toronto FC -->
|win_VAN=8 |draw_VAN=10 |loss_VAN=16 |gf_VAN=37 |ga_VAN=59  <!-- Vancouver Whitecaps -->
`;

class TeamSeason {
    mlsCup = false;
    shield = false;
    openCup = false;
    voyageursCup = false;

    points() {
        return (3 * this.wins) + parseInt(this.draws);
    }

    class() {
        return `${this.classBase} ${this.conference}`;
    }

    constructor(abbrev, wins, draws, losses, goalDiff) {
        if(!Object.keys(teamData).includes(abbrev)) {
            throw new Error(`Team data doesn't contain info for '${abbrev}'.  Is it a new team that needs to be added?`);
        }

        this.name = teamData[abbrev][0];
        this.classBase = teamData[abbrev][1];
        this.conference = teamData[abbrev][2];
        this.wins = parseInt(wins);
        this.draws = parseInt(draws);
        this.losses = parseInt(losses);
        this.goalDiff = parseInt(goalDiff);
    }
}

function getVal(entry) {
    let output = entry.split("=")[1].trim();

    if (output.includes('<!--')) {
        output = output.substring(0, output.indexOf('<!--')).trim();
    }

    return output;
}

function parseTeam(line) {
    let parts = line.trim().split('|').filter(x => x.length > 0);

    let teamAbbrev = parts[0].substring(4, 7);

    const team = new TeamSeason(teamAbbrev, getVal(parts[0]), getVal(parts[1]), getVal(parts[2]), getVal(parts[3]) - getVal(parts[4]));

    if (parts.length > 5) {
        const awards = getVal(parts[5]);
        if (awards.includes("X") || awards.includes("S")) { team.shield = true; } // Wikipedia changed from X to S to indicate Supporters Shield
        if (awards.includes("C")) { team.mlsCup = true; }
        if (awards.includes("U")) { team.openCup = true; }
        if (awards.includes("V")) { team.voyageursCup = true; }
    }
    
    return team;
};

function getTeams(tableFormat) {
    lines = tableFormat.trim().split("\n");

    const teams = [];
    
    for(i = 0; i < lines.length; i++) {
        teams.push(parseTeam(lines[i].trim()));
    }

    return teams;
}

function generateHtml(teams) {
    let output = `\t\t\t<ol class="table-list current" data-year="${year}">`;

    teams = teams.sort((t1, t2) => t2.points() - t1.points());

    teams.forEach(t => {
        let trophies = [];

        if (t.mlsCup) { trophies.push('mls-cup'); }
        if (t.shield) { trophies.push('supporters-shield'); }
        if (t.openCup) { trophies.push('open-cup'); }
        if (t.voyageursCup) { trophies.push('voyageurs-cup'); }

        if (trophies.length > 0) {
            trophies = ` class=\"${trophies.join(' ')}\"`;
        }

        output +=
        `
\t\t\t\t<li class="${t.class()}">
\t\t\t\t\t<span${trophies}>${t.name}</span>
\t\t\t\t\t<ul class="stats">
\t\t\t\t\t\t<li class="p">${t.points()}</li>
\t\t\t\t\t\t<li class="gd">${t.goalDiff}</li>
\t\t\t\t\t\t<li class="w">${t.wins}</li>
\t\t\t\t\t\t<li class="l">${t.losses}</li>
\t\t\t\t\t\t<li class="d">${t.draws}</li>
\t\t\t\t\t</ul>
\t\t\t\t</li>`;
    });

    output += `
\t\t\t</ol>`;

    return output;
}

let teamData = {
    ATL: ["Atlanta United", "atlanta-united", "eastern"],
    CHI: ["Chicago Fire", "chicago-fire", "eastern"],
    CIN: ["FC Cincinnati", "fc-cincinnati", "eastern"],
    COL: ["Colorado Rapids", "colorado-rapids", "western"],
    CLB: ["Columbus Crew", "columbus-crew", "eastern"],
    DAL: ["FC Dallas", "fc-dallas", "western"],
    DCU: ["DC United", "dc-united", "eastern"],
    HOU: ["Houston Dynamo", "houston-dynamo", "western"],
    LAX: ["LA Galaxy", "la-galaxy", "western"],
    LFC: ["LAFC", "la-fc", "western"],
    MIN: ["Minnesota United", "minnesota-united", "western"],
    MON: ["Montreal Impact", "impact-montreal", "eastern"],
    NEW: ["New England Revolution", "new-england-revolution", "eastern"],
    NYC: ["New York City FC", "new-york-city-fc", "eastern"],
    NYR: ["New York Red Bulls", "new-york-red-bulls", "eastern"],
    ORL: ["Orlando City", "orlando-city", "eastern"],
    PHI: ["Philadelphia Union", "philadelphia-union", "eastern"],
    POR: ["Portland Timbers", "portland-timbers", "western"],
    RSL: ["Real Salt Lake", "real-salt-lake", "western"],
    SJO: ["San Jose Earthquakes", "san-jose-earthquakes", "western"],
    SEA: ["Seattle Sounders", "seattle-sounders", "western"],
    SKC: ["Sporting Kansas City", "sporting-kansas-city", "western"],
    TOR: ["Toronto FC", "toronto-fc", "eastern"],
    VAN: ["Vancouver Whitecaps", "vancouver-whitecaps", "western"]
};

const teams = getTeams(input.trim());

const outputHtml = generateHtml(teams);

require('fs').writeFileSync(require('path').join(__dirname, '..', 'includes', year + '.php'), outputHtml);
/* 
 * GreenBean_JS.JS
 * 
 */
 
/******************************************************************************
 * 
 * Object Definitions
 * 
 ******************************************************************************/

/* constructor for goals_t objects */


/* constructor for goals_t objects */
function goal_t(high, low, points)
{
    this.high = high;
    this.low = low;
    this.points = points;
}

/* global variables */

/* Penalty Variables */
var penalty = 0;
var technical = 0;

var penalty_stack = new Array();

/* autonomous */
var auto_goals = new Array();
auto_goals[0] = new goal_t(0,0,0);
auto_goals[1] = new goal_t(0,0,0);

var auto_score_stack = new Array();

/* teleoperated */
var tele_goals = new Array();
tele_goals[0] = new goal_t(0,0,0);
tele_goals[1] = new goal_t(0,0,0);

var tele_front_court = 0;
var tele_full_court = 0;
var tele_human_loading = 0;    
var tele_floor_loading = 0;

var tele_driving = 0;
var tele_robot_block = 0;
var tele_robot_block_time = 0;

var tele_score_stack = new Array();

var tele_crossings = [0,0,0,0,0,0,0,0,0];
var tele_cross_stack = new Array();

/* end game */
var end_climb_speed = 0;

/******************************************************************************
 * Internal Functions
 *      These functions are to be handled internally in this .js file. Do not 
 *      call these externally.
 ******************************************************************************/

/*
 * Update Scoring Data
 */
function update_data()
{
    /* autonomous data */

    
    /* teleop data */
        tele_front_court = document.frm_shooting_location.shooting_location[0];
        tele_full_court = document.frm_shooting_location.shooting_location[1];
        
        tele_driving = document.getElementById('driving_ability').value;
        tele_robot_block = document.getElementById('robot_block').value;
        tele_robot_block_time = document.getElementById('robot_block_time').value;
        
    /* end data */
        end_climb_speed = document.getElementById('climb_speed').value;
        
    /* updatae points */
    update_points();
    
    /* update display */
    disp_update();
}

/* 
 * Updates the page displays
 */
function disp_update()
{
    /* autonomous */
    document.getElementById("auto_pts_display").innerHTML = auto_goals[0].points;   /* points made in auton */
    document.getElementById("auto_miss_display").innerHTML = auto_goals[1].points;  /* points missed in auton */
    
    /* teleop */
    document.getElementById("tele_pts_display").innerHTML = tele_goals[0].points;   /* points made in teleop */
    document.getElementById("tele_miss_display").innerHTML = tele_goals[1].points;  /* points missed in teleop */
    
    
    switch(tele_driving)
    {
        case '0':
            document.getElementById("tele_driving_display").innerHTML = "Little or No Movement";
            break;
        case '1':
            document.getElementById("tele_driving_display").innerHTML = "Poor Driving";
            break;
        case '2':
            document.getElementById("tele_driving_display").innerHTML = "Good Driving";
            break;
        case '3':
            document.getElementById("tele_driving_display").innerHTML = "Exceptional Driving";
            break;
    }
    
    document.getElementById("tele_robot_block_time_display").innerHTML = tele_robot_block_time;
    switch(tele_robot_block)
    {
        case '0':
            document.getElementById("tele_robot_block_display").innerHTML = "Awful / None";
            break;
        case '1':
            document.getElementById("tele_robot_block_display").innerHTML = "Not Very Effective";
            break;
        case '2':
            document.getElementById("tele_robot_block_display").innerHTML = "Good";
            break;
        case '3':
            document.getElementById("tele_robot_block_display").innerHTML = "It's Super Effective!";
            break;
    }

    document.getElementById("cullCounter").innerHTML = tele_crossings[0];
    document.getElementById("drawbridgeCounter").innerHTML = tele_crossings[1];
    document.getElementById("frisCounter").innerHTML = tele_crossings[2];
    document.getElementById("moatCounter").innerHTML = tele_crossings[3];
    document.getElementById("rampCounter").innerHTML = tele_crossings[4];
    document.getElementById("rockCounter").innerHTML = tele_crossings[5];
    document.getElementById("sallyCounter").innerHTML = tele_crossings[6];
    document.getElementById("terrainCounter").innerHTML = tele_crossings[7];
    document.getElementById("lowbarCounter").innerHTML = tele_crossings[8];
        
    /* end */
    document.getElementById("end_climb_speed_display").innerHTML = end_climb_speed;
    
    /* penalty */
    document.getElementById("penalty_display1").innerHTML = penalty;
    document.getElementById("technical_display1").innerHTML = technical;
    document.getElementById("penalty_display2").innerHTML = penalty;
    document.getElementById("technical_display2").innerHTML = technical;
    document.getElementById("penalty_display3").innerHTML = penalty;
    document.getElementById("technical_display3").innerHTML = technical;
}

/*
 * Updates the points values
 */
function update_points()
{
    /* update the autonomous point total */
    sum_points(auto_goals[0]);
    sum_points(auto_goals[1]);
    /* update the teleop point total */
    sum_points(tele_goals[0]);
    sum_points(tele_goals[1]);
}

/* 
 * summation of points
 */
function sum_points(var_config)
{
    /* sum disk points */
    var_config.points = 5 * var_config.high +
                        2 * var_config.low;
                
    /* double points in auton */
    if (var_config === auto_goals[0] || var_config === auto_goals[1] )
            var_config.points = 2* var_config.points;
}

// Replaced new_disk_score so that an undo score function could be easily added
function new_disk_score(period, status, goal)
{
    score_change(period, status, goal, 1);
}

/* 
 * new_disk_score
 */
function score_change(period, status, goal, change)
{
    var status_l;
    
    switch(status)
    {
    case 'make':
        status_l = 0; break;
    case 'miss':
        status_l = 1; break;
    }
            
    /* autonomous */
    if ( period === 'autonomous')
    {
        if(change > 0)
            auto_score_stack.push([status, goal]);
        auto_goals[status_l][goal]=auto_goals[status_l][goal]+change;
    }
    
    /* teleoperated */
    if ( period === 'teleop')
    {
        if(change > 0)
            tele_score_stack.push([status, goal]);
        tele_goals[status_l][goal]=tele_goals[status_l][goal]+change;
    }

}            

/*
 * Asses a penalty
 */
function new_penalty(type)
{
    switch(type)
    {
        case 'penalty':
            penalty =++ penalty;
            penalty_stack.push('penalty');
            break;
        case 'technical':
            technical =++ technical;
            penalty_stack.push('technical');
            break;
    }
    
}

/*
 * Crossing a defense in Teleop
 */
function new_defense_cross(type)
{
    tele_cross_stack.push(type);
    switch(type)
    {
        case 'cull':
            tele_crossings[0]++;
            break;
        case 'drawbridge':
            tele_crossings[1]++;
            break;
        case 'fris':
            tele_crossings[2]++;
            break;
        case 'moat':
            tele_crossings[3]++;
            break;
        case 'ramp':
            tele_crossings[4]++;
            break;
        case 'rock':
            tele_crossings[5]++;
            break;
        case 'sally':
            tele_crossings[6]++;
            break;
        case 'terrain':
            tele_crossings[7]++;
            break;
        case 'lowbar':
            tele_crossings[8]++;
            break;
    }
}

function save_data()
{
    var matchData = document.getElementById("scout_name_in").value + ",";
    matchData += document.getElementById("team_number_in").value + ",";
    matchData += document.getElementById("match_number_in").value + ",";
    matchData += document.getElementById("match_type").value + ",";
    matchData += document.getElementById("auto_pts_display").innerHTML + ",";
    matchData += document.getElementById("auto_miss_display").innerHTML + ",";
    matchData += (document.getElementById("Front_shoot").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Full_shoot").checked ? "T" : "F") + ",";
    matchData += document.getElementById("tele_pts_display").innerHTML + ",";
    matchData += document.getElementById("tele_miss_display").innerHTML + ",";
    matchData += tele_driving + ",";
    matchData += tele_robot_block + ",";
    matchData += tele_robot_block_time + ",";
    matchData += end_climb_speed + ",";
    matchData += penalty + ",";
    matchData += technical + ",";
    var comments = document.getElementById("Comments").value;
    comments = comments.replace(",","_"); //Get rid of commas so we don't mess up CSV
    comments = comments.replace("\n","   ");
    matchData += comments + "\n";
    var existingData = localStorage.getItem("MatchData");
    if(existingData == null)
        localStorage.setItem("MatchData",matchData);
    else
        localStorage.setItem("MatchData",existingData + matchData);
    document.getElementById("HistoryCSV").value = localStorage.getItem("MatchData");
}

//Clears all data in the form.  
//Do not call this unless it is ok to actually clear all data.
//This only resets stuff Nick felt should be reset
function reset_form()
{
    document.getElementById("team_number_in").value = "";
    document.getElementById("match_number_in").value++;
    
    auto_score_stack = new Array();
    auto_goals[0] = new goal_t(0,0,0);
    auto_goals[1] = new goal_t(0,0,0);
    
    tele_score_stack = new Array();
    document.getElementById("Front_shoot").checked = false;
    document.getElementById("Full_shoot").checked = false;
    tele_goals[0] = new goal_t(0,0,0);
    tele_goals[1] = new goal_t(0,0,0);
    tele_front_court = 0;
    tele_full_court = 0;
    tele_human_loading = 0;    
    tele_driving = 0;
    tele_robot_block = 0;
    tele_robot_block_time = 0;
    document.getElementById("driving_ability").value = 0;
    document.getElementById("robot_block").value = 0;
    document.getElementById("robot_block_time").value = 0;
    end_climb_speed = 0;
    document.getElementById("climb_speed").value = 0;
    
    penalty_stack = new Array();
    penalty = 0;
    technical = 0;
    document.getElementById("Comments").value="";
    
    
    update_data();
}


/* 
 * functions to be called from outside this .js file
 * 
 */

 function Defense_Cross(type)
 {
    new_defense_cross(type);
    update_data();
 }

/*
 * Disk scored.
 */
function Disk_Score(period, status, goal)
{
    /* a disk is scored */
    new_disk_score(period, status, goal);
    
    /* update point totals */
    update_data();                 
}

/*
 * Robot Climbed.
 */
function Robot_Climb()
{
    /* a robot climbs */
    //new_robot_climb(period, speed, height);
    
    /* update point totals */
    update_data();                 
}
            
/*
 * Penalty comitted
 */
function Penalty(type)
{
    new_penalty(type);
 
    /* update point totals */
    update_data();
}

//Undo a score if possible
function Undo_Score(period)
{
    switch(period)
    {
        case 'autonomous':
            if(auto_score_stack.length > 0)
            {
                var scoreData = auto_score_stack.pop();
                score_change(period, scoreData[0], scoreData[1], -1);
            }
            break;
        case 'teleop':
            if(tele_score_stack.length > 0)
            {
                var scoreData = tele_score_stack.pop();
                score_change(period, scoreData[0], scoreData[1], -1);
            }
            break;
    }
    update_data();
}

//Undo a penalty if possible
function Undo_Penalty()
{
    if(penalty_stack.length > 0)
    {
        var type = penalty_stack.pop();
        switch(type)
        {
        case 'penalty':
            penalty--; break;
        case 'technical':
            technical--; break;
        }
    }
    update_data();
}

//Undo defense crossing
function undo_defense_cross()
{
    if(tele_cross_stack.length > 0)
    {
        var type = tele_cross_stack.pop();
        switch(type)
        {
            case 'cull':
                tele_crossings[0]--;
                break;
            case 'drawbridge':
                tele_crossings[1]--;
                break;
            case 'fris':
                tele_crossings[2]--;
                break;
            case 'moat':
                tele_crossings[3]--;
                break;
            case 'ramp':
                tele_crossings[4]--;
                break;
            case 'rock':
                tele_crossings[5]--;
                break;
            case 'sally':
                tele_crossings[6]--;
                break;
            case 'terrain':
                tele_crossings[7]--;
                break;
            case 'lowbar':
                tele_crossings[8]--;
                break;
        }
    }
    update_data();
}

function Submit_Report()
{
    save_data();
    reset_form();
}

function Clear_History()
{
    if(document.getElementById("history_password").value == "Beans")
    {
        localStorage.clear();
        document.getElementById("HistoryCSV").value = "";
        $("#HistoryPass").hide(100,null);
    }
    else
    {
        document.getElementById("history_password").value = "Incorrect Password";
    }
}
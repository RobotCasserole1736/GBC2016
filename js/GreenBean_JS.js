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
            penalty =++ penalty; penalty_stack.push('penalty');break;
        case 'technical':
            technical =++ technical; penalty_stack.push('technical'); break;
    }
    
}

function save_data()
{
    var matchData = document.getElementById("scout_name_in").value + ",";
    matchData += document.getElementById("team_number_in").value + ",";
    matchData += document.getElementById("match_number_in").value + ",";
    matchData += document.getElementById("match_type").value + ",";
    matchData += (document.getElementById("spy").checked ? "T" : "F") + ",";
    matchData += document.getElementById("DroveToDefense").checked ? "T" : "F") + ",";
    matchData += document.getElementById("auto_pts_display").innerHTML + ",";
    matchData += document.getElementById("auto_miss_display").innerHTML + ",";
    var e = document.getElementById("AutoDefenseCrossed");
    matchData += e.options[e.selectedIndex].text + ",";
    matchData += (document.getElementById("Front_shoot").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("Full_shoot").checked ? "T" : "F") + ",";
    matchData += document.getElementById("tele_pts_display").innerHTML + ",";
    matchData += document.getElementById("tele_miss_display").innerHTML + ",";
    
   // Get teleop high/low points gained/missed still!!!
    
    matchData += tele_driving + ",";
    matchData += tele_robot_block + ",";
    matchData += tele_robot_block_time + ",";
    matchData += end_climb_speed + ",";
    matchData += document.getElementById("cullCounter").innerHTML + ",";
    matchData += document.getElementById("drawbridgeCounter").innerHTML + ",";
    matchData += document.getElementById("frisCounter").innerHTML + ",";
    matchData += document.getElementById("moatCounter").innerHTML + ",";
    matchData += document.getElementById("rampCounter").innerHTML + ",";
    matchData += document.getElementById("rockCounter").innerHTML + ",";
    matchData += document.getElementById("sallCounter").innerHTML + ",";
    matchData += document.getElementById("terrainCounter").innerHTML + ",";
    matchData += document.getElementById("frisCounter").innerHTML + ",";
    
    //Still need the stuck counter for each defense
    
    matchData += (document.getElementById("capture_attempt").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("capture_success").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("scale_attempt").checked ? "T" : "F") + ",";
    matchData += (document.getElementById("scale_success").checked ? "T" : "F") + ",";
    matchData += penalty + ",";
    matchData += technical + ",";
    
    //get rank in here too
   
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
	document.getElementByID("scout_name_in").value = "";
    document.getElementById("team_number_in").value = "";
    document.getElementById("match_number_in").value++;
    
    document.getElementByID("spy").checked = false;
    document.getElementByID("DroveToDefense").checked = false;
    auto_score_stack = new Array();
    auto_goals[0] = new goal_t(0,0,0);
    auto_goals[1] = new goal_t(0,0,0);
    var e = document.getElementById("AutoDefenseCrossed");
    e.value = "None"
    
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
    //do stuff for defenses
    document.getElementById("driving_ability").value = 0;
    document.getElementById("robot_block").value = 0;
    document.getElementById("robot_block_time").value = 0;
    document.getElementById("capture_attempt").checked = false;
    document.getElementById("capture_success").checked = false;
    document.getElementById("scale_attempt").checked = false;
    document.getElementById("scale_success").checked ? = false;
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
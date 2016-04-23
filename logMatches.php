<?php
   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('MatchData.db');
      }
   }
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      $results = $db->query('INSERT INTO ChampsData(ScoutName,TeamNumber,MatchNumber,MatchType,StartedSpy,DroveToDefense,AutoPtsScored,AutoPtsMissed,AutoDefenseCrossed, ShootsNearBatter,ShootsOuterWorks,ShootsCorner,TeleHighPtsScored,TeleHighPtsMissed,TeleLowPtsScored,TeleLowPtsMissed,DrivingAbility,DefenseEffectiveness,DefenseTime,PortcullisCrossCount, PortcullisStuck,ChevalCrossCount,ChevalStuck,MoatCrossCount,MoatStuck,RampartsCrossCount,RampartsStuck,DrawbridgeCrossCount,DrawbridgeStuck,SallyCrossCount,SallyStuck,RockwallCrossCount,RockwallStuck,RoughCrossCount,RoughStuck,LowbarCrossCount,LowbarStuck,CaptureAttempt,CaptureSuccess,ScaleAttempt,ScaleSuccess,ClimbSpeed,PenaltiesAuto,TechnicalsAuto,PenaltiesTele,TechnicalsTele,PenaltiesEnd,TechnicalsEnd,OverallRank,Comment) VALUES(' $_GET['ScoutName'] . ',' . $_GET['TeamNumber'] . ',' . $_GET['MatchNumber'] . ',' . $_GET['MatchType'] . ',' . $_GET['StartedSpy'] . ',' . $_GET['DroveToDefense'] . ',' . $_GET['AutoPtsScored'] . ',' . $_GET['AutoPtsMissed'] . ',' . $_GET['AutoDefenseCrossed'] . ',' . $_GET['ShootsNearBatter'] . ',' . $_GET['ShootsOuterWorks'] . ',' . $_GET['ShootsCorner'] . ',' . $_GET['TeleHighPtsScored'] . ',' . $_GET['TeleHighPtsMissed'] . ',' . $_GET['TeleLowPtsScored'] . ',' . $_GET['TeleLowPtsMissed'] . ',' . $_GET['DrivingAbility'] . ',' . $_GET['DefenseEffectiveness'] . ',' . $_GET['DefenseTime'] . ',' . $_GET['PortcullisCrossCount'] . ',' . $_GET['PortcullisStuck'] . ',' . $_GET['ChevalCrossCount'] . ',' . $_GET['ChevalStuck'] . ',' . $_GET['MoatCrossCount'] . ',' . $_GET['MoatStuck'] . ',' . $_GET['RampartsCrossCount'] . ',' . $_GET['RampartsStuck'] . ',' . $_GET['DrawbridgeCrossCount'] . ',' . $_GET['DrawbridgeStuck'] . ',' . $_GET['SallyCrossCount'] . ',' . $_GET['SallyStuck'] . ',' . $_GET['RockwallCrossCount'] . ',' . $_GET['RockwallStuck'] . ',' . $_GET['RoughCrossCount'] . ',' . $_GET['RoughStuck'] . ',' . $_GET['LowbarCrossCount'] . ',' . $_GET['LowbarStuck'] . ',' . $_GET['CaptureAttempt'] . ',' . $_GET['CaptureSuccess'] . ',' . $_GET['ScaleAttempt'] . ',' . $_GET['ScaleSuccess'] . ',' . $_GET['ClimbSpeed'] . ',' . $_GET['PenaltiesAuto'] . ',' . $_GET['TechnicalsAuto'] . ',' . $_GET['PenaltiesTele'] . ',' . $_GET['TechnicalsTele'] . ',' . $_GET['PenaltiesEnd'] . ',' . $_GET['TechnicalsEnd'] . ',' . $_GET['OverallRank'] . ',' . $_GET['Comment'] . ')');
      }
   }
?>
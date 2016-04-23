<?php
   class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('MatchData.db');
      }
   }
   header("Content-type: text/plain");
   header("Content-Disposition: attachment; filename=matchData.csv");
   $db = new MyDB();
   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      $results = $db->query('SELECT ScoutName,TeamNumber,MatchNumber,MatchType,StartedSpy,DroveToDefense,AutoPtsScored,AutoPtsMissed,AutoDefenseCrossed, ShootsNearBatter,ShootsOuterWorks,ShootsCorner,TeleHighPtsScored,TeleHighPtsMissed,TeleLowPtsScored,TeleLowPtsMissed,DrivingAbility,DefenseEffectiveness,DefenseTime,PortcullisCrossCount, PortcullisStuck,ChevalCrossCount,ChevalStuck,MoatCrossCount,MoatStuck,RampartsCrossCount,RampartsStuck,DrawbridgeCrossCount,DrawbridgeStuck,SallyCrossCount,SallyStuck,RockwallCrossCount,RockwallStuck,RoughCrossCount,RoughStuck,LowbarCrossCount,LowbarStuck,CaptureAttempt,CaptureSuccess,ScaleAttempt,ScaleSuccess,ClimbSpeed,PenaltiesAuto,TechnicalsAuto,PenaltiesTele,TechnicalsTele,PenaltiesEnd,TechnicalsEnd,OverallRank,Comment FROM ChampsData WHERE TeamNumber != "" ORDER BY MatchNumber');
      while ($row = $results->fetchArray()) {
         foreach($row as &$col){
            echo $col . ',';
         }
         echo '\n';
      }
   }
?>
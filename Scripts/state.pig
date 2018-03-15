Dataset = LOAD 's3://bigdataiupui/input/Traffic_Violations1.csv' USING PigStorage(',') AS (Date_of_Stop:chararray,
Time_Of_Stop:chararray,
Agency:chararray,
SubAgency:chararray,
Description:chararray,
Location:chararray,
Latitude:chararray,
Longitude:chararray,
Accident:chararray,
Belts:chararray,
Personal_Injury:chararray,
Property_Damage:chararray,
Fatal:chararray,
Commercial_License:chararray,
HAZMAT:chararray,
Commercial_Vehicle:chararray,
Alcohol:chararray,
Work_Zone:chararray,
State:chararray,
VehicleType:chararray,
Year:int,
Make:chararray,
Model:chararray,
Color:chararray,
Violation_Type:chararray,
Charge:chararray,
Article:chararray,
Contributed_To_Accident:chararray,
Race:chararray,
Gender:chararray,
Driver_City:chararray,
Driver_State:chararray,
DL_State:chararray,
Arrest_Type:chararray);

state_value = FOREACH Dataset GENERATE State as s;
State_group = GROUP state_value BY s;
output_value = FOREACH State_group GENERATE group, COUNT(state_value) as num;

--op1 = ORDER BY num DESC;

Dataset2 = LOAD 's3://bigdataiupui/input/state_list.csv' USING PigStorage(',') AS (Code:chararray,
State:chararray);

data_state = FOREACH Dataset2 GENERATE Code as c,State as st;

X = JOIN data_state by c, output_value by group;

op1 = ORDER X BY $3 DESC;

op = FOREACH op1 GENERATE $1,$3; 




STORE op INTO 's3://bigdataiupui/output/state_count';

Dataset = LOAD 's3://bigdataiupuiproject/Input/Traffic_Violations1.csv' USING PigStorage(',') AS (Date_of_Stop:chararray,
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


State_Commercial_License_Projection = FOREACH Dataset GENERATE Commercial_License, State;
State_Commercial_License_Filter = FILTER State_Commercial_License_Projection by Commercial_License == 'Yes'; 
State_Commercial_License_Group = GROUP State_Commercial_License_Filter BY (State, Commercial_License);
Result= FOREACH State_Commercial_License_Group GENERATE group.State, group.Commercial_License, COUNT(State_Commercial_License_Filter);


Dataset2 = LOAD 's3://bigdataiupuiproject/Input/state_list.csv' USING PigStorage(',') AS (Code:chararray,
State:chararray);

State_Code = FOREACH Dataset2 GENERATE Code as c,State as st;

X = JOIN State_Code by c, Result by State;

op = ORDER X BY $4 DESC;

op1 = FOREACH op GENERATE $0,$1,$4; 


STORE op1 INTO 's3://bigdataiupuiproject/output/State_Commercial_License_Count';


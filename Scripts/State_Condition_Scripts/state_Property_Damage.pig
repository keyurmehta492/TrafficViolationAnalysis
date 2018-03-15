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


State_Property_Damage_Projection = FOREACH Dataset GENERATE Property_Damage, State;
State_Property_Damage_Filter = FILTER State_Property_Damage_Projection by Property_Damage == 'Yes'; 
State_Property_Damage_Group = GROUP State_Property_Damage_Filter BY (State, Property_Damage);
Result= FOREACH State_Property_Damage_Group GENERATE group.State, group.Property_Damage, COUNT(State_Property_Damage_Filter);


Dataset2 = LOAD 's3://bigdataiupuiproject/Input/state_list.csv' USING PigStorage(',') AS (Code:chararray,
State:chararray);

State_Code = FOREACH Dataset2 GENERATE Code as c,State as st;

X = JOIN State_Code by c, Result by State;

op = ORDER X BY $4 DESC;

op1 = FOREACH op GENERATE $0,$1,$4; 


STORE op1 INTO 's3://bigdataiupuiproject/output/State_Property_Damage_Count';


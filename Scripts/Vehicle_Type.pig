Dataset = LOAD 's3://bigdataproj590/input/Traffic_Violations.csv' USING PigStorage(',') AS (Date_of_Stop:chararray,
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
VehicleType_projection = FOREACH Dataset GENERATE VehicleType;
VehicleType_group = GROUP VehicleType_projection BY VehicleType;
result= FOREACH VehicleType_group GENERATE group, COUNT(VehicleType_projection);
STORE result INTO 's3://bigdataproj590/output/Vehicle_Type_Wise';

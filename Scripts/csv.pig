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
ViolationType_projection = FOREACH Dataset GENERATE Violation_Type, Gender, Race;
ViolationType_group = GROUP ViolationType_projection BY (Violation_Type, Gender);
result= FOREACH ViolationType_group GENERATE group.Violation_Type, group.Gender, COUNT(ViolationType_projection);
STORE result INTO 's3://bigdataproj590/output/csv_3' 
using PigStorage('\t','-schema');
--fs -getmerge -nl s3://bigdataproj590/output/csv_3/pig_header  s3://bigdataproj590/output/csv_3/pig_schema;


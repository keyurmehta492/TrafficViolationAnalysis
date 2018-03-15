$(document).ready(function(){

    $("#chart_type").click(function () {
        var chart_type = $("#chart_type").find(":selected").text();
        if(chart_type == "Time Wise"){
            $("#options").hide();
        }else if(chart_type == "Gender Wise"){
            $("#options").show();
        }else if(chart_type == "Top Reason"){
            $("#options").hide();
        }
    });

});
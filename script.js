console.log('Homework 2-A...');
console.log('June');

d3.csv('./data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    console.log(rows);
    var trips = crossfilter(rows);

    var tripsByTime = trips.dimension(function(row){return row.startTime;});
    var tripsByGender = trips.dimension(function(row){return row.gender;});
    var tripsByType = trips.dimension(function(row){return row.type;});
    var tripsBySStation = trips.dimension(function(row){return row.startStation;});
    var tripsByDuration = trips.dimension(function(row){return row.duration;});
    var tripsByAge = trips.dimension(function(row){return row.age;});

    //Total number of trips in 2012
    //filter by start time
    tripsByTime.filter([new Date(2012,0,1,0,0,0),new Date(2012,11,31,11,59,59)]);//(2012,0,1),(2012,11,31)
    console.log('Total number of trips in 2012: '+tripsByTime.top(Infinity).length);

    //Total number of trips in 2012 AND taken by male, registered users
    //filter by gender
    tripsByGender.filter('Male');

    //filter by type
    tripsByType.filter('Registered');
    console.log('Total number of trips in 2012 AND taken by male, registered users: '+tripsByTime.top(Infinity).length);

    //Total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern (station id 5).
    //Reset Gender and Type filter
    tripsByGender.filter(null);
    tripsByType.filter(null);

    //filter by start station: Northeastern
    tripsBySStation.filter('5');
    console.log('Total number of trips in 2012, by all users, starting from Northeastern: '+tripsByTime.top(Infinity).length);

    //Top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration.
    //Reset Start Station filter
    tripsBySStation.filter(null);//tripsBySStation.filterAll()
    tripsByTime.filter(null);

    //console log
    console.log('Top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration: ');
    console.log(tripsByDuration.top(50));

    //Clear all filters if not

    //All filters already cleared

    //Group all trips into 10-year age buckets

    var tripsByAgeGroup = tripsByAge.group(function(d){return Math.floor(d/10);});
    console.log('Grouped all trips into 10-year age: ');
    console.log(tripsByAgeGroup.all());



}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        gender: d.gender==''? '0': d.gender,
        type: d.subsc_type,
        age: ageFunction(+d.birth_date,parseDate(d.start_date))
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

function ageFunction(birthDate,startDate)
{
    // set current year;
    //var currentDate= new Date();//changing to using start date (start_date)
    //var currentYear= currentDate.getFullYear();

    //set year of start_date
    var startYear = startDate.getFullYear();
    //console.log('1:'+startYear);
    //console.log('2:'+startDate);

    if(birthDate=='')
    return 'one';
    else
    return (startYear-birthDate);
}


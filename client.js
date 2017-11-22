var rp = require('request-promise');
var fs = require('fs');

var options = {
    method: 'POST',
    uri: 'https://localhost:8443/graphql',
    body: {
        "query": "{\n  CollegeSearch(CampusShortName:\"Seattle\") {\n    TotalCount\n    PageSize\n    PageStart\n    Colleges {\n      Href\n      CampusShortName\n      CollegeAbbreviation\n      CollegeFullName\n      CollegeFullNameTitleCased\n      CollegeName\n      CollegeShortName\n      Quarter\n      Year\n      Curricula {\n        TotalCount\n        PageSize\n        PageStart\n        Curricula {\n          CurriculumAbbreviation\n          CurriculumFullName\n          CurriculumName\n          Year\n          Quarter\n          Href\n          Courses {\n            TotalCount\n            PageSize\n            PageStart\n            Courses {\n              Href\n              Year\n              Quarter\n              CourseTitle\n              CourseTitleLong\n              CurriculumAbbreviation\n              CourseNumber\n              VerboseSections {\n                TotalCount\n                Sections {\n                  AddCodeRequired\n                  Auditors\n                  ClassWebsiteUrl\n                  CourseTitle\n                  Registrations {\n                    TotalCount\n                    PageSize\n                    PageStart\n                    Registrations {\n                      AccessDateRangeEnd\n                      AccessDateRangeStart\n                      Auditor\n                      Credits\n                      DuplicateCode\n                      EndDate\n                      FeeBaseType\n                      Grade\n                      GradeDate\n                      GradeDocumentID\n                      HonorsCourse\n                      Href\n                      IsActive\n                      IsCredit\n                      IsIndependentStart\n                      Metadata\n                      RepeatCourse\n                      RepositoryTimeStamp\n                      RequestDate\n                      RequestStatus\n                      StartDate\n                      VariableCredit\n                      WritingCourse\n                      Person {\n                        Href\n                        RegID\n                        CurrentEnrollment {\n                          ClassCode\n                          ClassDescription\n                          ClassLevel\n                          CurrentRegisteredCredits\n                          EnrollmentStatus\n                          EnrollmentStatusDate\n                          HonorsProgram\n                          LeaveEndQuarter\n                          LeaveEndYear\n                          Metadata\n                          PendingClassChange\n                          PendingHonorsChange\n                          PendingResidentChange\n                          PendingSpecialProgramChange\n                          RepositoryTimeStamp\n                          FullName\n                          RegID\n                        }\n                        SWSPerson {\n                          BirthDate\n                          DirectoryRelease\n                          Email\n                          EmployeeID\n                          FirstName\n                          Gender\n                          LastName\n                          LocalPhone\n                          MetaData\n                          PermanentPhone\n                          RegID\n                          RegisteredName\n                          RepositoryTimeStamp\n                          ResidencyDescription\n                          Resident\n                          StudentName\n                          StudentNumber\n                          StudentSystemKey\n                          UWNetID\n                          VisaType\n                        }\n                      }\n                    }\n                  }\n                  Meetings {\n                    Building\n                    BuildingToBeArranged\n                    DaysOfWeekToBeArranged\n                    EndTime\n                    MeetingIndex\n                    MeetingType\n                    RoomNumber\n                    RoomToBeArranged\n                    StartTime\n                    Instructors{\n                      PWSPerson {\n                        DisplayName\n                        IsTestEntity\n                        PreferredFirstName\n                        PreferredMiddleName\n                        PreferredSurname\n                        RegisteredFirstMiddleName\n                        RegisteredName\n                        RegisteredSurname\n                        RepositoryTimeStamp\n                        UIDNumber\n                        UWNetID\n                        UWRegID\n                        WhitePagesPublish\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}"
    },
    rejectUnauthorized: false,
    json: true // Automatically stringifies the body to JSON
};

var optionsTest = {
    method: 'POST',
    uri: 'https://localhost:8443/graphql',
    body: {
        "query": "{CollegeSearch {TotalCount PageSize PageStart Colleges { Href CampusShortName CollegeAbbreviation Quarter Year} }}"
    },
    rejectUnauthorized: false,
    json: true // Automatically stringifies the body to JSON
};

var start = Date.now();

rp.post(options).then(function (json) { 
    var fetchDone = Date.now();
    console.log("Fetch done in", fetchDone - start);
    fs.writeFile("output.txt", JSON.stringify(json), function(err) {
        if(err) {
            return console.log(err);
        }
        
        console.log("The file was saved in", Date.now() - fetchDone);
    }); 
});

const rp = require('request-promise');
import fs from 'fs';
import {buildRequest} from '../utils';

const BaseUrl = process.env.SWSBaseUrl;

const Resolvers = {
  GetTerm: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}term/${key}`, impersonate);
    return rp(req).then(res => JSON.parse(res));
  },
  SearchCurriculum: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}Curriculum?college_abbreviation=${args.CollegeAbbreviation || ''}&department_abbreviation=${args.DeptAbbr || ''}&future_terms=${args.FutureTerms || 0}&Quarter=${args.Quarter || ''}&Year=${args.Year || ''}`, impersonate);

    return rp(req).then(res => JSON.parse(res)).then(res => {
        let PageStart = args.PageStart || 0;
        let PageEnd = (args.PageSize || 10) + PageStart;
        // Curriculum does not support paging, we'll fake it
        res.Curricula = res.Curricula.slice(PageStart, PageEnd);
        return res;
    });
  },
  GetCurriculum: (args, impersonate) => {
    // Curriculum does not support Get One, we'll fake it
    return Resolvers.SearchCurriculum(args, impersonate).then(res => res.Curricula[0]);
  },
  CourseSearch: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}Course?changed_since_date=${args.ChangedSinceDate || ''}&course_number=${args.CourseNumber || ''}&course_title_contains=${args.CourseTitleContains || ''}&course_title_starts=${args.CourseTitleStarts || ''}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&future_terms=${args.FutureTerms || 0}&page_size=${args.PageSize || 10}&page_start=${args.PageStart || ''}&quarter=${args.Quarter}&transcriptable_course=${args.TranscriptableCourse || 'yes'}&year=${args.Year}&excludeCoursesWithoutSections=${args.ExcludeCoursesWithoutSections || ''}`, impersonate);

    return rp(req).then(res => JSON.parse(res));
  },
  GetCourse: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}course/${key}`, impersonate);
    return rp(req).then(res => JSON.parse(res));
  },
  SectionSearch: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}Section?year=${args.Year}&quarter=${args.Quarter}&future_terms=${args.FutureTerms || 0}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&course_number=${args.CourseNumber}&reg_id=${args.RegId || ''}&search_by=${args.SearchBy || ''}&include_secondaries=${args.IndcludeSecondaries || ''}&delete_flag=${args.DeleteFlag || ''}&changed_since_date=${args.ChangedSinceDate || ''}&transcriptable_course=${args.TranscriptableCourse || 'yes'}&page_size=${args.PageSize || 10}&page_start=${args.PageStart || ''}&facility_code=${args.FacilityCode || ''}&room_number=${args.RoomNumber || ''}&sln=${args.Sln || ''}`, impersonate);

    return rp(req).then(res => JSON.parse(res));
  },
  GetSection: (key, impersonate) => {
      let req = buildRequest(`${BaseUrl}Course/${key}`, impersonate);
      return rp(req).then(res => JSON.parse(res));
  },
  GetStudentPerson: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}person/${key}`, impersonate);
    return rp(req).then(res => JSON.parse(res));
  },
  SearchStudentPerson: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}/person?employee_id=${args.EmployeeID || ''}&net_id=${args.UWNetID || ''}&reg_id=${args.UWRegID || ''}&student_number=${args.StudentNumber || ''}&student_system_key=${args.StudentSystemkey || ''}`, impersonate);
    return rp(req).then(JSON.parse);
  },
  CollegeSearch: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}/college?campus_short_name=${args.CampusShortName || ''}&future_terms=${args.FutureTerms || 0}&quarter=${args.Quarter || ''}&year=${args.Year || ''}`, impersonate);
    
    return rp(req).then(JSON.parse);
  },
  GetCollege: (key, impersonate) => {
    return Resolvers.CollegeSearch({CampusShortName: key}, impersonate).then(res => res.Colleges[0]);
  },
  SearchRegistration: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}registration?changed_since_date=${args.ChangedSinceDate || ''}&course_number=${args.CourseNumber || ''}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&instructor_reg_id=${args.InstructorRegID || ''}&Quarter=${args.Quarter || ''}&reg_id=${args.RegID || ''}&section_id=${args.SectionID || ''}&transcriptable_course=${args.TranscriptableCourse || ''}&verbose=true&Year=${args.Year || ''}`, impersonate);
    
    return rp(req).then(JSON.parse);
  },
  GetEnrollment: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}enrollment?reg_id=${key}&verbose=true`, impersonate);

    return rp(req).then(JSON.parse);
  }
  
}

module.exports = Resolvers;
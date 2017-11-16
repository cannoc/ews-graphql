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
    let req = {
      uri: `${BaseUrl}Curriculum?college_abbreviation=${args.CollegeAbbr || ''}&department_abbreviation=${args.DeptAbbr || ''}&future_terms=${args.FutureTerms || 0}&Quarter=${args.Quarter}&Year=${args.Year}`,
      rejectUnauthorized: false,
      agentOptions: {
        pfx: fs.readFileSync('aisdev.pfx'),
        passphrase: 'XC4"Qx!C!z"\\whj]v7W'
      },
      headers
    }
    console.log(req.uri);
    return rp(req).then(res => JSON.parse(res)).then(res => {
        let PageStart = args.PageStart || 0;
        let PageEnd = (args.PageSize || 10) + PageStart;
        // Curriculum does not support paging, we'll fake it
        res.Curricula = res.Curricula.slice(PageStart, PageEnd);
        return res;
    });
  },
  GetCurriculum: (args) => {
    // Curriculum does not support Get One, we'll fake it
    return Resolvers.SearchCurriculum(args).then(res => res.Curricula[0]);
  },
  CourseSearch: (args) => {
    let req = {
      uri: `${BaseUrl}Course?changed_since_date=${args.ChangedSinceDate || ''}&course_number=${args.CourseNumber || ''}&course_title_contains=${args.CourseTitleContains || ''}&course_title_starts=${args.CourseTitleStarts || ''}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&future_terms=${args.FutureTerms || 0}&page_size=${args.PageSize || 10}&page_start=${args.PageStart || ''}&quarter=${args.Quarter}&transcriptable_course=${args.TranscriptableCourse || 'yes'}&year=${args.Year}&excludeCoursesWithoutSections=${args.ExcludeCoursesWithoutSections || ''}`,
      headers
    }
    console.log(req.uri);
    return rp(req).then(res => JSON.parse(res));
  },
  GetCourse: (key, impersonate) => {
    let req = {
      uri: `${BaseUrl}course/${key}`,
      headers
    }
    console.log(req.uri);
    return rp(req).then(res => JSON.parse(res));
  },
  SectionSearch: (args) => {
    let req = {
      uri: `${BaseUrl}Section?year=${args.Year}&quarter=${args.Quarter}&future_terms=${args.FutureTerms || 0}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&course_number=${args.CourseNumber}&reg_id=${args.RegId || ''}&search_by=${args.SearchBy || ''}&include_secondaries=${args.IndcludeSecondaries || ''}&delete_flag=${args.DeleteFlag || ''}&changed_since_date=${args.ChangedSinceDate || ''}&transcriptable_course=${args.TranscriptableCourse || 'yes'}&page_size=${args.PageSize || 10}&page_start=${args.PageStart || ''}&facility_code=${args.FacilityCode || ''}&room_number=${args.RoomNumber || ''}&sln=${args.Sln || ''}`,
      headers
    };
    console.log(req.uri);
    return rp(req).then(res => JSON.parse(res));
  },
  GetSection: (key, impersonate) => {
      let req = {
        uri: `${BaseUrl}Course/${key}`,
        headers
      };
      console.log(req.uri);
      return rp(req).then(res => JSON.parse(res));
  },
  GetStudentPerson: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}person/${key}`, impersonate);
    return rp(req).then(res => JSON.parse(res));
  },
  SearchStudentPerson: (args, impersonate) => {
    let req = buildRequest(`${BaseUrl}/person?employee_id=${args.EmployeeID || ''}&net_id=${args.UWNetID || ''}&reg_id=${args.UWRegID || ''}&student_number=${args.StudentNumber || ''}&student_system_key=${args.StudentSystemkey || ''}`, impersonate);
    return rp(req).then(JSON.parse);
  }
}

module.exports = Resolvers;
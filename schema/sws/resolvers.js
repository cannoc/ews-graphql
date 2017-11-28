const rp = require('request-promise');
import fs from 'fs';
import { buildRequest, PageResult, EncodeArguments } from '../utils';
import { Dispatcher } from '../dispatcher';

const BaseUrl = process.env.SWSBaseUrl;

const Resolvers = {
  GetTerm: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}term/${key}`, impersonate);
    return Dispatcher(req);
  },
  SearchCurriculum: (args, impersonate) => {
    args = EncodeArguments(args);
    let req = buildRequest(`${BaseUrl}Curriculum?college_abbreviation=${args.CollegeAbbreviation || ''}&department_abbreviation=${args.DeptAbbr || ''}&future_terms=${args.FutureTerms || 0}&Quarter=${args.Quarter || ''}&Year=${args.Year || ''}`, impersonate);
    return Dispatcher(req).then(res => {
      args.PageStart = args.PageStart == 0 ? 1 : args.PageStart;
      res.Curricula = PageResult(res.Curricula, args.PageStart, args.PageSize);
      res.PageStart = args.PageStart || 1;
      res.PageSize = args.PageSize || 10;
      return res;
    });
  },
  GetCurriculum: (args, impersonate) => {
    // Curriculum does not support Get One, we'll fake it
    return Resolvers.SearchCurriculum(args, impersonate).then(res => res.Curricula[0]);
  },
  SearchCourse: (args, impersonate) => {
    args = EncodeArguments(args);
    args.PageStart = args.PageStart == 0 ? 1 : args.PageStart;
    let req = buildRequest(`${BaseUrl}Course?changed_since_date=${args.ChangedSinceDate || ''}&course_number=${args.CourseNumber || ''}&course_title_contains=${args.CourseTitleContains || ''}&course_title_starts=${args.CourseTitleStarts || ''}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&future_terms=${args.FutureTerms || 0}&page_size=${args.PageSize || 10}&page_start=${args.PageStart || 1}&quarter=${args.Quarter}&transcriptable_course=${args.TranscriptableCourse || 'yes'}&year=${args.Year}&excludeCoursesWithoutSections=${args.ExcludeCoursesWithoutSections || ''}`, impersonate);

    return Dispatcher(req);
  },
  GetCourse: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}course/${key}`, impersonate);
    return Dispatcher(req);
  },
  SearchSection: (args, impersonate) => {
    args = EncodeArguments(args);
    args.PageStart = args.PageStart == 0 ? 1 : args.PageStart;
    let req = buildRequest(`${BaseUrl}Section?year=${args.Year}&quarter=${args.Quarter}&future_terms=${args.FutureTerms || 0}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&course_number=${args.CourseNumber}&reg_id=${args.RegId || ''}&search_by=${args.SearchBy || ''}&include_secondaries=${args.IndcludeSecondaries || ''}&delete_flag=${args.DeleteFlag || ''}&changed_since_date=${args.ChangedSinceDate || ''}&transcriptable_course=${args.TranscriptableCourse || 'yes'}&page_size=${args.PageSize || 10}&page_start=${args.PageStart || 1}&facility_code=${args.FacilityCode || ''}&room_number=${args.RoomNumber || ''}&sln=${args.Sln || ''}`, impersonate);

    return Dispatcher(req);
  },
  GetSection: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}Course/${key}`, impersonate);
    return Dispatcher(req);
  },
  GetStudentPerson: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}person/${key}`, impersonate);
    return Dispatcher(req);
  },
  SearchStudentPerson: (args, impersonate) => {
    args = EncodeArguments(args);
    let req = buildRequest(`${BaseUrl}/person?employee_id=${args.EmployeeID || ''}&net_id=${args.UWNetID || ''}&reg_id=${args.UWRegID || ''}&student_number=${args.StudentNumber || ''}&student_system_key=${args.StudentSystemkey || ''}`, impersonate);
    return rDispatcher(req);
  },
  SearchCollege: (args, impersonate) => {
    args = EncodeArguments(args);
    let req = buildRequest(`${BaseUrl}/college?campus_short_name=${args.CampusShortName || ''}&future_terms=${args.FutureTerms || 0}&quarter=${args.Quarter || ''}&year=${args.Year || ''}`, impersonate);
    
    return Dispatcher(req).then(res => {
      res.Colleges = PageResult(res.Colleges, args.PageStart, args.PageSize);
      res.PageStart = args.PageStart || 1;
      res.PageSize = args.PageSize || 10;
      return res;
    });
  },
  GetCollege: (key, impersonate) => {
    // No get college implemented, we'll fake it
    return Resolvers.SearchCollege({}, impersonate).then(res => res.Colleges.filter((coll) => {
      return coll.CollegeAbbreviation === key;
    })).then(res => res[0]);
  },
  SearchRegistration: (args, impersonate) => {
    args = EncodeArguments(args);
    let req = buildRequest(`${BaseUrl}registration?changed_since_date=${args.ChangedSinceDate || ''}&course_number=${args.CourseNumber || ''}&curriculum_abbreviation=${args.CurriculumAbbr || ''}&instructor_reg_id=${args.InstructorRegID || ''}&Quarter=${args.Quarter || ''}&reg_id=${args.RegID || ''}&section_id=${args.SectionID || ''}&transcriptable_course=${args.TranscriptableCourse || ''}&verbose=true&Year=${args.Year || ''}`, impersonate);
    
    return Dispatcher(req).then(res => {
      res.Registrations = PageResult(res.Registrations, args.PageStart, args.PageSize);
      res.PageStart = args.PageStart || 1;
      res.PageSize = args.PageSize || 10;
      return res;
    });
  },
  SearchEnrollment: (key, impersonate) => {
    let req = buildRequest(`${BaseUrl}enrollment?reg_id=${key}&verbose=true`, impersonate);

    return Dispatcher(req);
  },
  GetEnrollment: (args, impersonate) => {
    args = EncodeArguments(args);
    return Resolvers.SearchEnrollment(args.RegID, impersonate).then((enrollments) => {
      return enrollments.Enrollments.filter((enrollment) => {
        return enrollment.Term.Year === args.Year && enrollment.Term.Quarter === args.Quarter;
      })[0];
    })
  }
}

module.exports = Resolvers;
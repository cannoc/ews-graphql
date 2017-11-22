import DataLoader from 'dataloader';
import sws from './sws/resolvers';
import pws from './pws/resolvers';

function createLoaders(impersonate) {
    return {
        term: new DataLoader(keys => Promise.all(keys.map(key => sws.GetTerm(key, impersonate)))),
        course: new DataLoader(keys => Promise.all(keys.map(key => sws.GetCourse(key, impersonate)))),
        section: new DataLoader(keys => Promise.all(keys.map(key => sws.GetSection(key, impersonate)))),
        pwsPerson: new DataLoader(keys => Promise.all(keys.map(key => pws.GetPWSPerson(key, impersonate)))),
        swsPerson: new DataLoader(keys => Promise.all(keys.map(key => sws.GetStudentPerson(key, impersonate)))),
        enrollment: new DataLoader(keys => Promise.all(keys.map(key => sws.SearchEnrollment(key, impersonate))))
    }
  }

export default createLoaders;
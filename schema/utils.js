import fs from 'fs';


// Generates a comma delimited url encoded composite key
// eg. Term: {year},{quarter}, Course: {year},{quarter},{curriculum},{courseNumber}
const CompositeKey = function () {
  return encodeURI(Array.prototype.slice.call(arguments).join(','));
}

const buildRequest = function(uri, impersonate) {
  if(impersonate) {
    return {
      uri,
      agentOptions: {
        pfx: fs.readFileSync(process.env.CertFileName),
        passphrase: process.env.CertPassphrase
      },
      rejectUnauthorized: false,
      headers: {
        Accept: 'application/json',
        certificate_name: impersonate
      }
    }
  } else {
    return {
      uri,
      headers: {
        Accept: 'application/json',
        Authorization: process.env.AuthToken,
      }
    }
  }
}

function validateCert(cert) {
  if (cert.issuer.O.indexOf("University of Washington") < 0 ||
      cert.issuer.OU.indexOf("UW Services") < 0 ||
      cert.issuer.CN.indexOf("UW Services CA") < 0 ||
      cert.issuer.C.indexOf("US") < 0 ||
      cert.issuer.ST.indexOf("WA") < 0)
  {
      return false;
  }
  let now = Date.now();
  
  if(Date.parse(cert.valid_from) < now && now < Date.parse(cert.valid_to)) {
      return true;
  }
  return false;
}

module.exports = { CompositeKey, buildRequest, validateCert };
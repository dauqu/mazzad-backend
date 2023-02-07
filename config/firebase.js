//Module to configure firebase

const firebaseConfig = {
  type: "service_account",
  project_id: "mazzad-603b7",
  private_key_id: "c26aa877749dba12dcf9e60d339c84b3462e66bc",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXzIfDrjXkKzyU\nr6ujHRe/lsAd3il0/i6AhhPnTNsmIXUtx3nhcI/vaxGdHmPiCdqy0RUptZOyUAPn\nOe9+tK8p74dQr/OfNaXoEcwm/czI8glO0RUcMhGCXm34TU1IlylXEZdxB5OQVjmE\nllikeQciYP3aJvjm+REn06u3T8f/Vp5ApcEspqBrpbKwPtym7uIfb7Lczd9sqfWd\ndDO8vioiQeNAlqB3XFViRlk9zmJ8/MWzEQPXrOLQZTcfuhqTce8l1J/pET1NLf1k\n8u2KebdZKEneYvB5/mGEcTYAlIaS1YpmPYpqserY0ZeHmEBQ3bx9fkCL0ilJeW/j\nJWrDt9WJAgMBAAECggEAMDJ+7xIxeKK8ftPmcIGerHyBr5oPJdFgdvWbK+mTN6a4\n2m7nNpXym81My4v+UH2VciM3CBAFKwnqeUIMDr9RsPrNvNRzg89SXOzerSW5z3aZ\nZBhYD+pR1U18X7z6Ihia09a6vXSs/Ut4wLdomGFsmb3SbJ8QL9wYfA3vV/uSZmFb\nrcqShMZEh6yiIm2NwnovETwapWl3JXiAkNhEivCF8TGkY33jFlJkgxk7Gl98Fhhg\n9q947WiIjYzAanzTR5xSDWHo00SXHAiLV0X6xk7dScGyBDHXmgKYHNB3o323aZF1\nnpbpa99Q0qEybvMFfIGdqpmQivrr5Bi97TYDWOWMVQKBgQD7rfzgzna1nEFc2eRk\nv+hes6O+QaKhIqqbUozR3HidSgXft4RxZzICyBAsMpBGzv93UX3sdhay4aCk385W\n/m6NkG9PAwesa4HDBp7FFxEIUbcUT+sG/wjzdMZXbDwfjDzPwJSy7bTOxEGiODPO\n6UBlrgen8zQVUVKWE0720I2JHQKBgQDbgN0segjOGzYCNajpEYoRzRjj2uvH/Gkw\nxl/vl0KVWF7lOlqp8QwZYGHeyOcmgjoHdInwGyBDnaVJjePNMZm13M57Wx1IhBv9\nKHElbuYGmhRz3GDffe/wvsono4QHEp089iD11iWL8eXGO/dvh0uW7q2ezMEzDW4Q\nVQxpafg+XQKBgAXMfnUXjLimfwMKqi6AFXSJIw6xKHQZ/mBRyJjVQZouKHB9I/oQ\n7KAPx/+csqJPBqfTItmd5uv8Mt1ZosFyX023tDjX0wdv+q9pqaLU4zmT2GoJZVrl\n6WjimedNwRzg+E25HDP7Mh1JfFGmhdsQmME+/0IpYlvTYdm/XCRnrbspAoGBAKQf\nZEBfNro06lsYmCU8cgoBWnz0MZukhVps2UqhxK06GCo5SZULoMpQoJ0dhofqk00D\nvCeFgMhN1Up8BzpjvdSXNuRRKkIQVYUiegdNNjz1dBl1TBGPbpqJbUnaH1vSdTMh\nrV9jMUvEINPp/oarmL9P0w2Ld2Gexw77KH6hN3YZAoGAI8Kf3NEIEQ2ikb9k9Agd\nH3HskhO41+MAK2g+JYrFi21zDQkarNC8CMpBpayXHCK3vtlhSMnB4qgVfjXcR849\nvcP8cWBpyQUb5IQeoNGsE/cOVh0u3fOm4hw8vwypY1cnXiswb/fMn03kvBmIZuDg\nL2BO9HWeYjJuhIdrk170XqU=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-62bah@mazzad-603b7.iam.gserviceaccount.com",
  client_id: "103275316726895661810",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-62bah%40mazzad-603b7.iam.gserviceaccount.com",
};

//Export const variable to use in other files
module.exports = {
  fire_auth: firebaseConfig,
};

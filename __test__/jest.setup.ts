import { getOttomanInstances, Ottoman } from '../src';
import { bucketName, connectionString, password, username } from './testData';

beforeEach(async () => {
  let options = {};
  if (process.env.OTTOMAN_LEGACY_TEST) {
    options = { collectionName: '_default' };
  }

  const ottoman = new Ottoman(options);
  await ottoman.connect({
    password,
    username,
    connectionString,
    bucketName,
  });
});

afterEach(async () => {
  for (const instance of getOttomanInstances()) {
    await instance.close();
  }
});

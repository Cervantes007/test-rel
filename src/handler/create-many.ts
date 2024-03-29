import { ModelMetadata } from '../model/interfaces/model-metadata.interface';
import { batchProcessQueue } from './utils';
import { StatusExecution } from './types';
import { ModelTypes, saveOptions } from '../model/model.types';

/**
 * Async Function: Create many documents at once
 *
 * @param documents List of documents to create
 *
 * @return (ManyQueryResponse)[(/classes/queryresponse.html)]
 */
export const createMany =
  <T = any>(metadata: ModelMetadata) =>
  async (documents: unknown[], options: saveOptions = {}) => {
    return await batchProcessQueue(metadata)(documents, createManyCallback, {}, options, 100);
  };

/**
 * @ignore
 */
export const createManyCallback = (
  document: ModelTypes,
  metadata: ModelMetadata,
  extra: any,
  options: saveOptions = {},
): Promise<StatusExecution> => {
  const Model = metadata.ottoman.getModel(metadata.modelName);
  return Model.create(document, options)
    .then((created) => {
      return Promise.resolve(new StatusExecution(created, 'SUCCESS'));
    })
    .catch((error) => {
      /* istanbul ignore next */
      return Promise.reject(new StatusExecution(document, 'FAILURE', error.constructor.name, error.message));
    });
};

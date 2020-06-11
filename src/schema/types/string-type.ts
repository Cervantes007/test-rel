import { CoreType, CoreTypeOptions } from './core-type';
import { generateUUID } from '../../utils/generate-uuid';

type FunctionsString = () => string[];

export interface StringTypeOptions {
  enum?: string[] | FunctionsString;
}

export class StringType extends CoreType {
  constructor(name: string, options?: CoreTypeOptions & StringTypeOptions) {
    super(name, String.name, options);
  }

  get enumValues(): unknown {
    const _options = this.options as StringTypeOptions;
    return _options.enum;
  }

  async applyValidations(value: string): Promise<string[]> {
    const errors: string[] = [];
    if (typeof this.enumValues !== 'undefined') {
      const _enumValues = typeof this.enumValues === 'function' ? this.enumValues() : this.enumValues;
      if (!_enumValues.includes(value)) {
        errors.push(`Property ${this.name} value must be ${_enumValues.join(',')}`);
      }
    }
    return errors;
  }

  buildDefault(): string {
    if (this.auto === 'uuid') {
      return generateUUID();
    }
    return String(super.buildDefault());
  }

  isEmpty = (value: string): boolean => [, '', null].includes(value);
}

export const stringTypeFactory = (key: string, opts: StringTypeOptions & CoreTypeOptions): StringType =>
  new StringType(key, opts);

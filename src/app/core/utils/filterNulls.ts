import { filter } from 'rxjs/operators';
import { Observable, MonoTypeOperatorFunction } from 'rxjs';

export const filterNulls = <T>(): MonoTypeOperatorFunction<T> => filter<T>(val => val !== null);

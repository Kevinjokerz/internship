import { asyncHandler } from "../helpers";
import { FunctionBase } from "lodash";

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-return */
function LogCatchAsyncPrototype(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function CatchAsyncDecorator(context: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    class DecoratedClass extends constructor {
      constructor(...args: any[]) {
        super(...args);

        // Keep the 'name' property in class
        Object.defineProperty(DecoratedClass, "name", {
          value: constructor.name,
        });

        // Get all the properties name in class
        const methods = Object.getOwnPropertyNames(constructor.prototype);
        methods.forEach((method) => {
          const descriptor: PropertyDescriptor =
            Object.getOwnPropertyDescriptor(constructor.prototype, method)!;
          const isFunction = descriptor?.value instanceof Function;

          if (isFunction) {
            // Apply asyncHandler for methods
            const methodFunction: FunctionBase = (this as any)[method];
            Object.defineProperty(
              this,
              method,
              LogCatchAsyncPrototype(this, method, {
                value: asyncHandler(methodFunction, context),
              })
            );
          }
        });
      }
    }
    return DecoratedClass;
  };
}

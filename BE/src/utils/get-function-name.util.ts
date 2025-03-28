/**
 * @function getFunctionCallerName
 * @returns {}
 */
function getFunctionCallerName(): string {
  const error = (new Error().stack as string).match(/at (\S+)/g);
  return (error as RegExpMatchArray)[1].slice(3).replace("Object.", "");
}

export { getFunctionCallerName };

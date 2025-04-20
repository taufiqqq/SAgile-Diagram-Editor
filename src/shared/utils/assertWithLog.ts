export function assertWithLog(condition: boolean, errorMessage: string, successMessage: string) {
    if (!condition) {
      console.assert(condition, errorMessage);
    } else {
      console.log(successMessage);
    }
  }
/**
   * Execute FileMaker Script
   * @param {object} data - Data (JSON) to use in FileMaker Script
   * @param {string} scriptName - Name of the script from FileMaker
   */
function execFileMaker(data, scriptName) {
        if (typeof FileMaker !== 'undefined') {
          FileMaker.PerformScript(
            scriptName,
            JSON.stringify(data)
          );
        } else {
          alert('FileMaker no definido');
        }
      }

export { execFileMaker };
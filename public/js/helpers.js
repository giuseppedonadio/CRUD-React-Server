window.helpers = (function () {
  function newRun(attrs = {}) {
    const run = {
      length: attrs.length || 'Run',
      unit: attrs.unit || 'Unit',
      pace: attrs.pace || 'Pace',
      unitPace: attrs.unitPace || 'Min/Mil',
      id: uuid.v4(), // eslint-disable-line no-undef

    };

    return run;
  }
  return {
    newRun
  };
}());

const params = {
  //
};

const values = Object.keys(params).reduce((acc, key) => {
  const def = params[key];

  let _value: any = null;

  const set = (value) => {
    _value = value;
    return _value;
  };

  const value = () => {
    return _value;
  };

  acc[key] = {
    set,
    value,
  };

  return acc;
}, {} as Record<keyof typeof params, {
  set: (value: string) => void;
  value: () => string;
}>);

// @ts-ignore
window.values = values;

window.onload = function() {
  handleSyncValues();
};

function handleSyncValues() {
  //
}

// @ts-ignore
window.handleSyncValues = handleSyncValues;

(async () => {
  document.querySelector('body').innerHTML = `
  <div style="padding: 24px;display: flex; flex: 1; flex-direction: row"">
  </div>
  `;
})();

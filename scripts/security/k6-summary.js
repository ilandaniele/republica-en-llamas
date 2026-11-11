function escape(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );
}

export function summarize(data, { name, profile, scope, target, details = {} }) {
  const thresholds = Object.entries(data.metrics).flatMap(([metricName, metric]) =>
    Object.entries(metric.thresholds || {}).map(([rule, result]) => ({
      name: metricName,
      rule,
      ok: result.ok,
    })),
  );
  const passed = thresholds.length > 0 && thresholds.every((item) => item.ok);
  const report = {
    project: 'republica-en-llamas',
    scope,
    profile,
    target,
    ...details,
    passed,
    thresholds,
    k6: data,
  };
  const rows = Object.entries(data.metrics)
    .map(
      ([metricName, metric]) =>
        `<tr><td>${escape(metricName)}</td><td><pre>${escape(JSON.stringify(metric.values, null, 2))}</pre></td></tr>`,
    )
    .join('');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Local load: ${escape(name)}</title><style>body{font-family:system-ui;max-width:1100px;margin:2rem auto;padding:1rem}td{border:1px solid #aaa;padding:.6rem;vertical-align:top}pre{white-space:pre-wrap}</style><h1>${escape(name)}: ${passed ? 'PASS' : 'FAIL'}</h1><p>${escape(scope)}</p><pre>${escape(JSON.stringify(profile, null, 2))}</pre><h2>Thresholds</h2><pre>${escape(JSON.stringify(thresholds, null, 2))}</pre><table>${rows}</table></html>`;
  return {
    [`${__ENV.LOAD_OUTPUT}/${name}.json`]: JSON.stringify(report, null, 2),
    [`${__ENV.LOAD_OUTPUT}/${name}.html`]: html,
    stdout: `${name}: ${passed ? 'PASS' : 'FAIL'}; ${data.metrics.http_reqs?.values?.count || 0} HTTP requests\n`,
  };
}

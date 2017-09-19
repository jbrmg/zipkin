import {component} from 'flightjs';
import $ from 'jquery';
import {getError} from '../../js/component_ui/error';
import traceToMustache from '../../js/component_ui/traceToMustache';

export function toContextualLogsUrl(logsUrl, traceId, trace) {
  const functionPrefix = 'js:';
  if (logsUrl) {
    if (logsUrl.startsWith(functionPrefix)) {
      const funcFromConf = logsUrl.slice(-logsUrl.length + functionPrefix.length).trim();
      return Function.apply(undefined, ['traceId', 'trace', funcFromConf])(traceId, trace);
    } else {
      return logsUrl.replace('{traceId}', traceId);
    }
  }
  return logsUrl;
}

export default component(function TraceData() {
  this.after('initialize', function() {
    const traceId = this.attr.traceId;
    $.ajax(`/zipkin/api/v1/trace/${traceId}`, {
      type: 'GET',
      dataType: 'json'
    }).done(trace => {
      const logsUrl = toContextualLogsUrl(this.attr.logsUrl, traceId, trace);
      const modelview = traceToMustache(trace, logsUrl);
      this.trigger('tracePageModelView', {modelview, trace});
    }).fail(e => {
      this.trigger('uiServerError',
        getError(`Cannot load trace ${this.attr.traceId}`, e));
    });
  });
});

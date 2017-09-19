import {toContextualLogsUrl} from '../../js/component_data/trace';

describe('toContextualLogsUrl', () => {
  it('replaces token in logsUrl when set', () => {
    const kibanaLogsUrl = 'http://company.com/kibana/#/discover?_a=(query:(query_string:(query:\'{traceId}\')))';
    const traceId = '86bad84b319c8379';
    toContextualLogsUrl(kibanaLogsUrl, traceId)
      .should.equal(kibanaLogsUrl.replace('{traceId}', traceId));
  });

  it('returns logsUrl when not set', () => {
    const kibanaLogsUrl = undefined;
    const traceId = '86bad84b319c8379';
    (typeof toContextualLogsUrl(kibanaLogsUrl, traceId)).should.equal('undefined');
  });

  it('generates the logs url by executing a function if provided', () => {
    const kibanaLogsUrl = 'js: return traceId + \'_\' + trace[0].timestamp;';
    const traceId = '86bad84b319c8379';
    const trace = [{timestamp: 500}];
    toContextualLogsUrl(kibanaLogsUrl, traceId, trace).should.equal('86bad84b319c8379_500');
  });

  it('returns the same url when token not present', () => {
    const kibanaLogsUrl = 'http://mylogqueryservice.com/';
    const traceId = '86bad84b319c8379';
    toContextualLogsUrl(kibanaLogsUrl, traceId).should.equal(kibanaLogsUrl);
  });
});

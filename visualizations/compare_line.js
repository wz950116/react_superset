import CompareFilter from '../javascripts/components/CompareFilter/CompareFilter';
import nvd3Vis from './nvd3_vis';

// require('moment/locale/zh-cn');

// const $ = require('jquery');

function compareLineVis(slice, payload) {
  const filterId = 'filter_container_' + slice.formData.slice_id;
  const chartId = 'chart_container_' + slice.formData.slice_id;

  const container = $(slice.selector);
  container.html('');
  container.append(
    '<div >\n' +
    '      <div id=' + filterId + ' class="col-md-12"></div >\n' +
    '      <div id=' + chartId + ' ></div >\n' +
    '    </div >');

  const cfSlice = Object.assign(slice, { containerId: filterId });
  CompareFilter(cfSlice, payload);

  const ctSlice = Object.assign(slice,
    {
      containerId: chartId,
      container: $('#' + chartId),
      selector: '#' + chartId,
    },
  );
  nvd3Vis(ctSlice, payload);
}

module.exports = compareLineVis;

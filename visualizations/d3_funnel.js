import $ from 'jquery';
import d3 from 'd3';
import D3Funnel from 'd3-funnel';
import './d3_funnel.css';

function nvd3Vis(slice, payload) {
  // clear
  const d3token = d3.select(slice.selector);
  d3token.selectAll('*').remove();

  // 实例
  const chart = new D3Funnel(slice.selector);

  // 源数据
  const { data } = payload;

  // 渲染数据
  const newData = [];

  const len = data.length - 1;

  data.forEach((item, index) => {
    newData.push({
      label: item.label,
      value: item.value,
    });
    if (index > 0) newData[index].value = `${item.value}(${((item.value / data[index - 1].value) * 100000 / 1000).toFixed(2)}%)`;
  });

  $(document).ready(function () {
    $(slice.selector).css('text-align', 'center').find('g').hover(function () {
      $(this).children('text').css({
        fontSize: '20px',
      });
    }, function () {
      $(slice.selector).find('g').children('text').css({
        fontSize: '16px',
      });
    });
  });

  const options = {
    chart: {
      bottomWidth: len / 8,
      width: 700,
      height: 320,
    },
    block: {
      dynamicHeight: false,
      minHeight: 25,
      highlight: true,
    },
    label: {
      fontSize: '16px',
      format: '{l}\n{v}',
    },
  };
  chart.draw(newData, options);
}
module.exports = nvd3Vis;

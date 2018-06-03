import React from 'react';
import { formatSelectOptionsForRange, formatSelectOptions } from '../../modules/utils';
import visTypes from './visTypes';
import * as v from '../validators';

const D3_FORMAT_DOCS = 'D3 format syntax: https://github.com/d3/d3-format';

// input choices & options
const D3_TIME_FORMAT_OPTIONS = [
  [',.', ',. | 12'],
  ['.1234', '. | 1234'],
  ['.3s', '.3s | 12.3k'],
  ['.3%', '.3% | 1234543.210%'],
  ['.4r', '.4r | 12350'],
  ['.3f', '.3f | 12345.432'],
  ['+,', '+, | +12,345.4321'],
  ['$,.2f', '$,.2f | $12,345.43'],
];

const ROW_LIMIT_OPTIONS = [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000];

const SERIES_LIMITS = [0, 5, 10, 25, 50, 100, 500];

export const TIME_STAMP_OPTIONS = [
  ['smart_date', 'Adaptative formating'],
  ['%m/%d/%Y', '%m/%d/%Y | 01/14/2019'],
  ['%Y-%m-%d', '%Y-%m-%d | 2019-01-14'],
  ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M:%S | 2019-01-14 01:32:10'],
  ['%H:%M:%S', '%H:%M:%S | 01:32:10'],
];

export const controls = {
  datasource: {
    type: 'SelectControl',
    label: '数据源',
    isLoading: true,
    clearable: false,
    default: null,
    mapStateToProps: (state) => {
      const datasources = state.datasources || [];
      return {
        choices: datasources,
        isLoading: datasources.length === 0,
        rightNode: state.datasource ?
          <a href={state.datasource.edit_url}>edit</a>
          : null,
      };
    },
    description: '',
  },

  viz_type: {
    type: 'SelectControl',
    label: '图表类型',
    clearable: false,
    default: 'table',
    choices: Object.keys(visTypes).map(vt => [
      vt,
      visTypes[vt].label,
      `/static/assets/images/viz_thumbnails/${vt}.png`,
    ]),
    description: '显示图表类型',
  },

  metrics: {
    type: 'SelectControl',
    multi: true,
    label: '度量值',
    validators: [v.nonEmpty],
    default: control =>
      control.choices && control.choices.length > 0 ? [control.choices[0][0]] : null,
    mapStateToProps: state => ({
      choices: (state.datasource && state.datasource.metrics_combo.length > 0) ? state.datasource.metrics_combo : (state.datasource_type === 'es' ? [["count", "COUNT(*)"]] : []),
    }),
    description: '显示一个或多个度量值',
  },

  order_by_cols: {
    type: 'SelectControl',
    multi: true,
    label: '排序',
    default: [],
    description: '显示一个或多个度量',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.order_by_choices : [],
    }),
  },

  metric: {
    type: 'SelectControl',
    label: '度量',
    clearable: false,
    description: '选择度量',
    default: control =>
      control.choices && control.choices.length > 0 ? control.choices[0][0] : null,
    mapStateToProps: state => ({
      // choices: (state.datasource) ? state.datasource.metrics_combo : null,
      choices: (state.datasource && state.datasource.metrics_combo.length > 0) ? state.datasource.metrics_combo : (state.datasource_type === 'es' ? [["count", "COUNT(*)"]] : []),
    }),
  },

  metric_2: {
    type: 'SelectControl',
    label: '轴的合适的度量值',
    choices: [],
    default: [],
    description: '选择轴的合适度量值',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  stacked_style: {
    type: 'SelectControl',
    label: '堆积式',
    choices: [
      ['stack', 'stack'],
      ['stream', 'stream'],
      ['expand', 'expand'],
    ],
    default: 'stack',
    description: '',
  },

  linear_color_scheme: {
    type: 'SelectControl',
    label: '线性配色方案',
    choices: [
      ['fire', 'fire'],
      ['blue_white_yellow', 'blue/white/yellow'],
      ['white_black', 'white/black'],
      ['black_white', 'black/white'],
    ],
    default: 'blue_white_yellow',
    description: '',
  },

  normalize_across: {
    type: 'SelectControl',
    label: '数据标准化',
    choices: [
      ['heatmap', 'heatmap'],
      ['x', 'x'],
      ['y', 'y'],
    ],
    default: 'heatmap',
    description: '颜色将基于单元格与该标准下总和的比例来呈现',
  },

  horizon_color_scale: {
    type: 'SelectControl',
    label: '色阶范围',
    choices: [
      ['series', 'series'],
      ['overall', 'overall'],
      ['change', 'change'],
    ],
    default: 'series',
    description: '定义颜色的强弱.',
  },

  canvas_image_rendering: {
    type: 'SelectControl',
    label: '渲染形式',
    choices: [
      ['pixelated', 'pixelated (Sharp)'],
      ['auto', 'auto (Smooth)'],
    ],
    default: 'pixelated',
    description: '画布对象的图像呈现CSS属性，用于定义浏览器如何放大图像',
  },

  xscale_interval: {
    type: 'SelectControl',
    label: 'X轴间距',
    choices: formatSelectOptionsForRange(1, 50),
    default: '1',
    description: 'X轴每个刻度的单位长度',
  },

  yscale_interval: {
    type: 'SelectControl',
    label: 'Y轴间距',
    choices: formatSelectOptionsForRange(1, 50),
    default: null,
    description: 'Y轴每个刻度的单位长度',
  },

  include_time: {
    type: 'CheckboxControl',
    label: '显示时间',
    description: '是否包含时间段中定义的时间粒度',
    default: false,
  },

  bar_stacked: {
    type: 'CheckboxControl',
    label: '分段条形图',
    renderTrigger: true,
    default: false,
    description: null,
  },

  show_markers: {
    type: 'CheckboxControl',
    label: '显示标记',
    renderTrigger: true,
    default: false,
    description: '显示线上以圆圈标记的数据值',
  },

  show_bar_value: {
    type: 'CheckboxControl',
    label: '带值条形图',
    default: false,
    renderTrigger: true,
    description: '在条形柱顶部显示其数值',
  },

  order_bars: {
    type: 'CheckboxControl',
    label: '条形图排序',
    default: false,
    description: '按X标签对条形图进行排序.',
  },

  show_controls: {
    type: 'CheckboxControl',
    label: '额外控制',
    renderTrigger: true,
    default: false,
    description: '是否显示额外的控件。额外的控制措施包括使多个条形图堆叠或并排.',
  },

  reduce_x_ticks: {
    type: 'CheckboxControl',
    label: '减小x刻度间隔',
    renderTrigger: true,
    default: false,
    description: '减少要渲染的X轴刻度的数量.如果为true，则x轴不会溢出，并且标签可能会丢失。如果为false，则最小宽度将应用于列，宽度可能会溢出到水平滚动。',
  },

  include_series: {
    type: 'CheckboxControl',
    label: '显示项目',
    renderTrigger: true,
    default: false,
    description: '坐标上显示项目名称',
  },

  secondary_metric: {
    type: 'SelectControl',
    label: '色彩度量项',
    default: null,
    description: '在颜色上使用的度量值',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  country_fieldtype: {
    type: 'SelectControl',
    label: '国家名称编码方式',
    default: 'cca2',
    choices: [
      ['name', 'Full name'],
      ['cioc', 'code International Olympic Committee (cioc)'],
      ['cca2', 'code ISO 3166-1 alpha-2 (cca2)'],
      ['cca3', 'code ISO 3166-1 alpha-3 (cca3)'],
    ],
    description: '国家代码确保了superset可以在数据库的[国家]列中找到对应的国家名称类型',
  },

  groupby: {
    type: 'SelectControl',
    multi: true,
    label: '分组',
    default: [],
    description: '根据一个或多个控件进行分组',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  columns: {
    type: 'SelectControl',
    multi: true,
    label: '列',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
    default: [],
    description: '将一个或多个字段做为列',
  },

  all_columns: {
    type: 'SelectControl',
    multi: true,
    label: '列',
    default: [],
    description: '显示列',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  all_columns_x: {
    type: 'SelectControl',
    label: 'X轴对应的项目',
    default: null,
    description: '显示X轴对应的项目(列)',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  all_columns_y: {
    type: 'SelectControl',
    label: 'Y轴对应的项目',
    default: null,
    description: '显示Y轴对应的项目(列)',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  druid_time_origin: {
    type: 'SelectControl',
    freeForm: true,
    label: '起点',
    choices: [
      ['', 'default'],
      ['now', 'now'],
    ],
    default: null,
    description: '定义时间起点，支持`now`, `sunday` 或 `1970-01-01`等时间格式',
  },

  bottom_margin: {
    type: 'SelectControl',
    freeForm: true,
    label: '底部留白',
    choices: formatSelectOptions(['auto', 50, 75, 100, 125, 150, 200]),
    default: 'auto',
    description: '允许为底部轴标签提供更多空间',
  },

  granularity: {
    type: 'SelectControl',
    freeForm: true,
    label: '时间粒度',
    default: 'one day',
    choices: formatSelectOptions([
      'all',
      '5 seconds',
      '30 seconds',
      '1 minute',
      '5 minutes',
      '1 hour',
      '6 hour',
      '1 day',
      '7 days',
      'week',
      'week_starting_sunday',
      'week_ending_saturday',
      'month',
    ]),
    description: '图表时间粒度。可以使用简单的自然语言比如`10 seconds`, `1 day` 或 `56 weeks`等',
  },

  domain_granularity: {
    type: 'SelectControl',
    label: '区域时间段',
    default: 'month',
    choices: formatSelectOptions(['hour', 'day', 'week', 'month', 'year']),
    description: '用于划分分组块的时间单位',
  },

  subdomain_granularity: {
    type: 'SelectControl',
    label: '子域',
    default: 'day',
    choices: formatSelectOptions(['min', 'hour', 'day', 'week', 'month']),
    description: '每个子域时间段应小于区域时间段，大于等于时间粒度。',
  },

  link_length: {
    type: 'SelectControl',
    freeForm: true,
    label: '链接长度',
    default: '200',
    choices: formatSelectOptions(['10', '25', '50', '75', '100', '150', '200', '250']),
    description: '有向图中的链接长度',
  },

  charge: {
    type: 'SelectControl',
    freeForm: true,
    label: '缩放',
    default: '-500',
    choices: formatSelectOptions([
      '-50',
      '-75',
      '-100',
      '-150',
      '-200',
      '-250',
      '-500',
      '-1000',
      '-2500',
      '-5000',
    ]),
    description: '有向图缩放大小',
  },

  granularity_sqla: {
    type: 'SelectControl',
    label: '时间字段',
    default: control =>
      control.choices && control.choices.length > 0 ? control.choices[0][0] : null,
    description: '图表中的时间字段。可以定义返回"DATETIME"的任意表达式；',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.granularity_sqla : [],
    }),
  },

  time_grain_sqla: {
    type: 'SelectControl',
    label: '时间粒度',
    default: control => control.choices && control.choices.length ? control.choices[0][0] : null,
    description: '图表中的时间粒度可适用于日期的转换',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.time_grain_sqla : null,
    }),
  },

  resample_rule: {
    type: 'SelectControl',
    freeForm: true,
    label: '重采样规则',
    default: null,
    choices: formatSelectOptions(['', '1T', '1H', '1D', '7D', '1M', '1AS']),
    description: '重采样规则',
  },

  resample_how: {
    type: 'SelectControl',
    freeForm: true,
    label: '重采样方式',
    default: null,
    choices: formatSelectOptions(['', 'mean', 'sum', 'median']),
    description: '重采样方式',
  },

  resample_fillmethod: {
    type: 'SelectControl',
    freeForm: true,
    label: '插值方式',
    default: null,
    choices: formatSelectOptions(['', 'ffill', 'bfill']),
    description: '重采样插值方式',
  },

  since: {
    type: 'SelectControl',
    freeForm: true,
    label: '起始时间',
    default: '7 days ago',
    choices: formatSelectOptions([
      '1 day ago',
      '7 days ago',
      '28 days ago',
      '90 days ago',
      '1 year ago',
      '100 year ago',
    ]),
    description: '过滤器中的时间戳支持自由打字和自然语言如 `1 day ago`, `28 days` 或 `3 years`',
  },

  until: {
    type: 'SelectControl',
    freeForm: true,
    label: '终止时间',
    default: 'now',
    choices: formatSelectOptions([
      'now',
      '1 day ago',
      '7 days ago',
      '28 days ago',
      '90 days ago',
      '1 year ago',
    ]),
  },

  max_bubble_size: {
    type: 'SelectControl',
    freeForm: true,
    label: '气泡最大尺寸',
    default: '25',
    choices: formatSelectOptions(['5', '10', '15', '25', '50', '75', '100']),
  },

  whisker_options: {
    type: 'SelectControl',
    freeForm: true,
    label: '异常值选项',
    default: 'Tukey',
    description: '计算异常值的方法',
    choices: formatSelectOptions([
      'Tukey',
      'Min/max (no outliers)',
      '2/98 percentiles',
      '9/91 percentiles',
    ]),
  },

  treemap_ratio: {
    type: 'TextControl',
    label: '比例',
    isFloat: true,
    default: 0.5 * (1 + Math.sqrt(5)),  // d3 default, golden ratio
    description: '矩形树图的长宽比',
  },

  number_format: {
    type: 'SelectControl',
    freeForm: true,
    label: '数字格式',
    default: D3_TIME_FORMAT_OPTIONS[0],
    choices: D3_TIME_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  row_limit: {
    type: 'SelectControl',
    freeForm: true,
    label: '行数上限',
    default: null,
    choices: formatSelectOptions(ROW_LIMIT_OPTIONS),
  },

  limit: {
    type: 'SelectControl',
    freeForm: true,
    label: '时间序列上限',
    choices: formatSelectOptions(SERIES_LIMITS),
    default: 50,
    description: '限制显示的时间序列的数目',
  },

  timeseries_limit_metric: {
    type: 'SelectControl',
    label: '排序依据',
    default: null,
    description: '顶端序列的度量方式',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  rolling_type: {
    type: 'SelectControl',
    label: '滚动',
    default: 'None',
    choices: formatSelectOptions(['None', 'mean', 'sum', 'std', 'cumsum']),
    description: '滚动窗口的应用，配合[周期]使用',
  },

  rolling_periods: {
    type: 'TextControl',
    label: '周期',
    isInt: true,
    description: '滚动窗口大小，取值和时间粒度相关',
  },

  series: {
    type: 'SelectControl',
    label: '项目',
    default: null,
    description: '定义分组实体。每个项目有特定的颜色和图例',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  entity: {
    type: 'SelectControl',
    label: '实体',
    default: null,
    description: '在图表上绘制的元素',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  x: {
    type: 'SelectControl',
    label: 'X轴',
    default: null,
    description: 'X轴对应的度量值',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  y: {
    type: 'SelectControl',
    label: 'Y轴',
    default: null,
    description: 'Y轴对应的度量值',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  size: {
    type: 'SelectControl',
    label: '气泡大小',
    default: null,
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo : [],
    }),
  },

  url: {
    type: 'TextControl',
    label: '为仪表盘生成一个可读的URL',
    description: 'URL, 这个控制器是模板化的, 所以你可以在URL字符串中将“宽”和“高”一体化.',
    default: 'https://www.youtube.com/embed/AdSZJzb-aX8',
  },

  x_axis_label: {
    type: 'TextControl',
    label: 'X轴名称',
    renderTrigger: true,
    default: '',
  },

  y_axis_label: {
    type: 'TextControl',
    label: 'Y轴名称',
    renderTrigger: true,
    default: '',
  },

  where: {
    type: 'TextControl',
    label: '自定义WHERE语句',
    default: '',
    description: '此框中的语句将包含到WHERE子句中，并用AND连接到其他条件。可以包含复杂句、括号、以及其他任意能被后端直接支持的语句。',
  },

  having: {
    type: 'TextControl',
    label: 'HAVING语句',
    default: '',
    description: '语句将包含到HAVE子句中，并用AND连接到其他条件。可以包含复杂句、括号、以及其他任意能被后端直接支持的语句。',
  },

  compare_lag: {
    type: 'TextControl',
    label: '滞后比较周期',
    isInt: true,
    description: '基于时间粒度，与时间周期进行比较',
  },

  compare_suffix: {
    type: 'TextControl',
    label: '后缀文字',
    description: '百分比后面显示的文本',
  },

  table_timestamp_format: {
    type: 'SelectControl',
    freeForm: true,
    label: '时间格式',
    default: 'smart_date',
    choices: TIME_STAMP_OPTIONS,
    description: '时间格式',
  },

  series_height: {
    type: 'SelectControl',
    freeForm: true,
    label: '项目高度',
    default: '25',
    choices: formatSelectOptions(['10', '25', '40', '50', '75', '100', '150', '200']),
    description: '每个项目的像素高度',
  },

  page_length: {
    type: 'SelectControl',
    freeForm: true,
    label: '页面长度',
    default: 0,
    choices: formatSelectOptions([0, 10, 25, 40, 50, 75, 100, 150, 200]),
    description: '每个页面的行数，0表示没有分页',
  },

  x_axis_format: {
    type: 'SelectControl',
    freeForm: true,
    label: 'X轴数值格式',
    renderTrigger: true,
    default: 'smart_date',
    choices: TIME_STAMP_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  y_axis_format: {
    type: 'SelectControl',
    freeForm: true,
    label: 'Y轴数值格式',
    renderTrigger: true,
    default: '.3s',
    choices: D3_TIME_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  y_axis_2_format: {
    type: 'SelectControl',
    freeForm: true,
    label: '轴合适的格式',
    default: '.3s',
    choices: D3_TIME_FORMAT_OPTIONS,
    description: D3_FORMAT_DOCS,
  },

  markup_type: {
    type: 'SelectControl',
    label: '标记类型',
    choices: formatSelectOptions(['markdown', 'html']),
    default: 'markdown',
    description: '选择你最喜欢的标记语言',
  },

  rotation: {
    type: 'SelectControl',
    label: '旋转',
    choices: formatSelectOptions(['random', 'flat', 'square']),
    default: 'random',
    description: '词汇云中词语的旋转方式',
  },

  line_interpolation: {
    type: 'SelectControl',
    label: '线形',
    renderTrigger: true,
    choices: formatSelectOptions(['linear', 'basis', 'cardinal',
      'monotone', 'step-before', 'step-after']),
    default: 'linear',
    description: '线形值的定义',
  },

  pie_label_type: {
    type: 'SelectControl',
    label: '标签类型',
    default: 'key',
    choices: [
      ['key', 'Category Name'],
      ['value', 'Value'],
      ['percent', 'Percentage'],
    ],
    description: '标签上应该显示什么？',
  },

  code: {
    type: 'TextAreaControl',
    label: '代码',
    description: '输入代码',
    default: '',
  },

  pandas_aggfunc: {
    type: 'SelectControl',
    label: '聚合函数',
    clearable: false,
    choices: formatSelectOptions([
      'sum',
      'mean',
      'min',
      'max',
      'median',
      'stdev',
      'var',
    ]),
    default: 'sum',
    description: '汇总和计算行和列时所使用的的聚合函数',
  },

  size_from: {
    type: 'TextControl',
    isInt: true,
    label: '最小字体',
    default: '20',
    description: '列表中最小值的字体大小',
  },

  size_to: {
    type: 'TextControl',
    isInt: true,
    label: '最大字体',
    default: '150',
    description: '列表中最大值的字体大小',
  },

  instant_filtering: {
    type: 'CheckboxControl',
    label: '即时过滤',
    renderTrigger: true,
    default: true,
    description: (
      '条件改变时是否使用过滤器，或者等待用户点击［应用］按键'
    ),
  },

  show_brush: {
    type: 'CheckboxControl',
    label: '区间过滤',
    renderTrigger: true,
    default: false,
    description: '是否显示时间区间选择控件',
  },

  date_filter: {
    type: 'CheckboxControl',
    label: '时间过滤',
    default: false,
    description: '是否显示时间过滤器',
  },

  show_datatable: {
    type: 'CheckboxControl',
    label: '数据明细表',
    default: false,
    description: '是否显示数据交互表',
  },

  include_search: {
    type: 'CheckboxControl',
    label: '搜索框',
    renderTrigger: true,
    default: false,
    description: '是否显示客户端搜索框',
  },

  table_filter: {
    type: 'CheckboxControl',
    label: '表',
    default: false,
    description: '单击表单元格时是否应用筛选器',
  },

  show_bubbles: {
    type: 'CheckboxControl',
    label: '显示气泡',
    default: false,
    renderTrigger: true,
    description: '是否在国家上显示气泡',
  },

  show_legend: {
    type: 'CheckboxControl',
    label: '图例',
    renderTrigger: true,
    default: true,
    description: '是否显示图例',
  },

  x_axis_showminmax: {
    type: 'CheckboxControl',
    label: 'X轴边界',
    renderTrigger: true,
    default: true,
    description: '是否显示X轴的最大最小值',
  },

  rich_tooltip: {
    type: 'CheckboxControl',
    label: '详细信息',
    renderTrigger: true,
    default: true,
    description: '显示特定时间点的所有项目',
  },

  y_axis_zero: {
    type: 'CheckboxControl',
    label: 'Y轴从0开始',
    default: false,
    renderTrigger: true,
    description: 'Y轴值从0开始，不是从最小值开始',
  },

  y_log_scale: {
    type: 'CheckboxControl',
    label: 'Y轴对数刻度',
    default: false,
    renderTrigger: true,
    description: 'Y轴刻度值按照对数分布显示',
  },

  x_log_scale: {
    type: 'CheckboxControl',
    label: 'X轴对数刻度',
    default: false,
    renderTrigger: true,
    description: 'X轴刻度值按照对数分布显示',
  },

  donut: {
    type: 'CheckboxControl',
    label: '环形图',
    default: false,
    description: '你想用饼状图还是环形图？',
  },

  labels_outside: {
    type: 'CheckboxControl',
    label: '标签置于图标外面',
    default: true,
    description: '将标签放在图标外面',
  },

  contribution: {
    type: 'CheckboxControl',
    label: '贡献值',
    default: false,
    description: '计算总和中的贡献值',
  },

  num_period_compare: {
    type: 'TextControl',
    label: '周期比',
    default: '',
    isInt: true,
    description: '[整数]要比较的周期数，和粒度有关',
  },

  period_ratio_type: {
    type: 'SelectControl',
    label: '周期比类型',
    default: 'growth',
    choices: formatSelectOptions(['factor', 'growth', 'value']),
    description: '`factor` 表示 (new/previous), `growth` 等于((new/previous) - 1), `value` 等于(new-previous)',
  },

  time_compare: {
    type: 'TextControl',
    label: '时间迁移',
    default: null,
    description: '相关时间周期内的时间迁移。相对时间，如:  24 hours, 7 days, 56 weeks, 365 days',
  },

  subheader: {
    type: 'TextControl',
    label: '子标题',
    description: '在数字下显示的文本',
  },

  mapbox_label: {
    type: 'SelectControl',
    multi: true,
    label: '标记',
    default: [],
    description: '对分组使用COUNT(*)',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.all_cols : [],
    }),
  },

  mapbox_style: {
    type: 'SelectControl',
    label: '图层样式',
    choices: [
      ['mapbox://styles/mapbox/streets-v9', 'Streets'],
      ['mapbox://styles/mapbox/dark-v9', 'Dark'],
      ['mapbox://styles/mapbox/light-v9', 'Light'],
      ['mapbox://styles/mapbox/satellite-streets-v9', 'Satellite Streets'],
      ['mapbox://styles/mapbox/satellite-v9', 'Satellite'],
      ['mapbox://styles/mapbox/outdoors-v9', 'Outdoors'],
    ],
    default: 'mapbox://styles/mapbox/streets-v9',
    description: '图层样式',
  },

  clustering_radius: {
    type: 'SelectControl',
    freeForm: true,
    label: '簇半径',
    default: '60',
    choices: formatSelectOptions([
      '0',
      '20',
      '40',
      '60',
      '80',
      '100',
      '200',
      '500',
      '1000',
    ]),
    description: '定义簇的半径大小(单位为像素)。0表示不显示簇。点的数量过大（>1000)将会导致显示缓慢。',
  },

  point_radius: {
    type: 'SelectControl',
    label: '点半径',
    default: 'Auto',
    description: '不在簇中的点的半径是一个数字列或‘auto’，它根据最大的簇来自动调整。',
    mapStateToProps: state => ({
      choices: [].concat([['Auto', 'Auto']], state.datasource.all_cols),
    }),
  },

  point_radius_unit: {
    type: 'SelectControl',
    label: '点半径单位',
    default: 'Pixels',
    choices: formatSelectOptions(['Pixels', 'Miles', 'Kilometers']),
    description: '指定点半径的度量单位',
  },

  global_opacity: {
    type: 'TextControl',
    label: '不透明度',
    default: 1,
    isFloat: true,
    description: '所有簇、点和标签的不透明度. 在0到1之间',
  },

  viewport_zoom: {
    type: 'TextControl',
    label: '缩放(Zoom)',
    isFloat: true,
    default: 11,
    description: '地图缩放级别(Zoom level of the map)',
    places: 8,
  },

  viewport_latitude: {
    type: 'TextControl',
    label: '默认纬度',
    default: 37.772123,
    isFloat: true,
    description: '视窗默认纬度',
    places: 8,
  },

  viewport_longitude: {
    type: 'TextControl',
    label: '默认经度',
    default: -122.405293,
    isFloat: true,
    description: '视窗默认经度',
    places: 8,
  },

  render_while_dragging: {
    type: 'CheckboxControl',
    label: '实时更新',
    default: true,
    description: '点和簇将根据视窗变化进行实时更新',
  },

  mapbox_color: {
    type: 'SelectControl',
    freeForm: true,
    label: 'RGB颜色',
    default: 'rgb(0, 122, 135)',
    choices: [
      ['rgb(0, 139, 139)', 'Dark Cyan'],
      ['rgb(128, 0, 128)', 'Purple'],
      ['rgb(255, 215, 0)', 'Gold'],
      ['rgb(69, 69, 69)', 'Dim Gray'],
      ['rgb(220, 20, 60)', 'Crimson'],
      ['rgb(34, 139, 34)', 'Forest Green'],
    ],
    description: 'RGB中点和簇的颜色',
  },

  ranges: {
    type: 'TextControl',
    label: '范围',
    default: '',
    description: '用阴影突出需要显示的范围',
  },

  range_labels: {
    type: 'TextControl',
    label: '范围标签',
    default: '',
    description: '表示范围的标签',
  },

  markers: {
    type: 'TextControl',
    label: '标记',
    default: '',
    description: '用三角形标记的值列表',
  },

  marker_labels: {
    type: 'TextControl',
    label: '标记标签(Marker labels)',
    default: '',
    description: '表示标记的标签',
  },

  marker_lines: {
    type: 'TextControl',
    label: '标记线(Marker lines)',
    default: '',
    description: '使用线(line)标记的值列表 ',
  },

  marker_line_labels: {
    type: 'TextControl',
    label: '标记线的标签(Marker line labels)',
    default: '',
    description: '表示标记线的标签',
  },

  filters: {
    type: 'FilterControl',
    label: '',
    default: [],
    description: '',
    mapStateToProps: state => ({
      datasource: state.datasource,
    }),
  },

  having_filters: {
    type: 'FilterControl',
    label: '',
    default: [],
    description: '',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.metrics_combo
        .concat(state.datasource.filterable_cols) : [],
      datasource: state.datasource,
    }),
  },

  slice_id: {
    type: 'HiddenControl',
    label: 'Slice ID',
    hidden: true,
    description: 'The id of the active slice',
  },

  cache_timeout: {
    type: 'HiddenControl',
    label: '缓存有效时长 (秒)',
    hidden: true,
    description: '缓存到期之前的秒数',
  },

  entity_province: {
    type: 'SelectControl',
    multi: false,
    label: '省份控件',
    description: '根据一个或多个控件进行分组',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  entity_city: {
    type: 'SelectControl',
    multi: false,
    label: '城市控件',
    description: '根据一个或多个控件进行分组',
    mapStateToProps: state => ({
      choices: (state.datasource) ? state.datasource.gb_cols : [],
    }),
  },

  heatmap_color_start: {
    type: 'ColorControl',
    label: '浅色',
    description: '输入起始颜色',
    default: '#AFC9D6',
  },

  heatmap_color_end: {
    type: 'ColorControl',
    label: '深色',
    description: '输入终止颜色',
    default: '#204466',
  },
};
export default controls;

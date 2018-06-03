export const sections = {
  druidTimeSeries: {
    label: '时间',
    description: '时间相关的属性',
    controlSetRows: [
      ['granularity', 'druid_time_origin'],
      ['since', 'until'],
    ],
  },
  datasourceAndVizType: {
    label: '数据源 & 图表样式',
    controlSetRows: [
      ['datasource'],
      ['viz_type'],
      ['slice_id', 'cache_timeout'],
    ],
  },
  sqlaTimeSeries: {
    label: '时间',
    description: '时间相关的表格属性',
    controlSetRows: [
      ['granularity_sqla', 'time_grain_sqla'],
      ['since', 'until'],
    ],
  },
  sqlClause: {
    label: 'SQL',
    controlSetRows: [
      ['where'],
      ['having'],
    ],
    description: '用于定制SQL语句',
  },
  NVD3TimeSeries: [
    {
      label: null,
      controlSetRows: [
        ['metrics'],
        ['groupby'],
        ['limit', 'timeseries_limit_metric'],
      ],
    },
    {
      label: '高级分析',
      description: '使用高级分析选项',
      controlSetRows: [
        ['rolling_type', 'rolling_periods'],
        ['time_compare'],
        ['num_period_compare', 'period_ratio_type'],
        ['resample_how', 'resample_rule'],
        ['resample_fillmethod'],
      ],
    },
  ],
  filters: [
    {
      label: '过滤查询',
      description: '使用逗号分隔多个过滤条件，如US,FR,Other' +
      '将value控件留空以过滤空字符串或空值' +
      '过滤带有逗号的值，需用单引号扩住' +
      '例如 NY, Tahoe, CA, DC',
      controlSetRows: [['filters']],
    },
    {
      label: '后置过滤器',
      description: '只过滤搜索结果，而不过滤聚合.' +
      '将value控件留空以过滤空字符串或空值',
      controlSetRows: [['having_filters']],
    },
  ],
};

const visTypes = {
  area_heatmap: {
    label: '地区热力图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: '控件',
        controlSetRows: [
          ['entity_province'],
          ['entity_city'],
        ],
      },
      {
        label: '颜色',
        controlSetRows: [
          ['heatmap_color_start', 'heatmap_color_end'],
          ['metric'],
        ],
      }
    ],
  },

  funnel: {
    label: '漏斗图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['limit', 'timeseries_limit_metric'],
        ],
      },
    ],
  },

  compare_line: {
    label: '对比时间数列-折线图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表选项',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['rich_tooltip', 'y_axis_zero'],
          ['y_log_scale', 'contribution'],
          ['show_markers', 'x_axis_showminmax'],
          ['line_interpolation', 'include_search'],
          ['x_axis_format', 'y_axis_format'],
          ['x_axis_label', 'y_axis_label'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  dist_bar: {
    label: '分布-条形图',
    controlPanelSections: [
      {
        label: '图表选项',
        controlSetRows: [
          ['metrics'],
          ['groupby'],
          ['columns'],
          ['row_limit'],
          ['show_legend', 'show_bar_value'],
          ['bar_stacked', 'order_bars'],
          ['y_axis_format', 'bottom_margin'],
          ['x_axis_label', 'y_axis_label'],
          ['reduce_x_ticks', 'contribution'],
          ['show_controls'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '项目',
      },
      columns: {
        label: '拆分',
        description: '项目的拆分方式',
      },
    },
  },

  pie: {
    label: '饼图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics', 'groupby'],
          ['limit'],
          ['pie_label_type'],
          ['donut', 'show_legend'],
          ['labels_outside'],
        ],
      },
    ],
  },

  line: {
    label: '时间数列-折线图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表选项',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['rich_tooltip', 'y_axis_zero'],
          ['y_log_scale', 'contribution'],
          ['show_markers', 'x_axis_showminmax'],
          ['line_interpolation'],
          ['x_axis_format', 'y_axis_format'],
          ['x_axis_label', 'y_axis_label'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  dual_line: {
    label: '时间数列-双轴折线图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: '图表选项',
        controlSetRows: [
          ['x_axis_format'],
        ],
      },
      {
        label: 'Y 轴 1',
        controlSetRows: [
          ['metric'],
          ['y_axis_format'],
        ],
      },
      {
        label: 'Y 轴 2',
        controlSetRows: [
          ['metric_2'],
          ['y_axis_2_format'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: '左轴度量',
        description: '选择左轴的度量值',
      },
      y_axis_format: {
        label: '左轴数值格式',
      },
    },
  },

  bar: {
    label: '时间数列-柱状图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表选项',
        controlSetRows: [
          ['show_brush', 'show_legend', 'show_bar_value'],
          ['rich_tooltip', 'y_axis_zero'],
          ['y_log_scale', 'contribution'],
          ['x_axis_format', 'y_axis_format'],
          ['line_interpolation', 'bar_stacked'],
          ['x_axis_showminmax', 'bottom_margin'],
          ['x_axis_label', 'y_axis_label'],
          ['reduce_x_ticks', 'show_controls'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  compare: {
    label: '时间数列-百分比变化',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      sections.NVD3TimeSeries[1],
    ],
  },

  area: {
    label: '时间数列-堆积图',
    requiresTime: true,
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表选项',
        controlSetRows: [
          ['show_brush', 'show_legend'],
          ['rich_tooltip', 'y_axis_zero'],
          ['y_log_scale', 'contribution'],
          ['x_axis_format', 'y_axis_format'],
          ['x_axis_showminmax', 'show_controls'],
          ['line_interpolation', 'stacked_style'],
        ],
      },
      sections.NVD3TimeSeries[1],
    ],
  },

  table: {
    label: '表视图',
    controlPanelSections: [
      {
        label: '分组 GROUP BY',
        description: '进行聚合查询',
        controlSetRows: [
          ['groupby', 'metrics'],
          ['include_time'],
        ],
      },
      {
        label: '不分组 NOT GROUPED BY',
        description: '展示原始数据查询',
        controlSetRows: [
          ['all_columns'],
          ['order_by_cols'],
        ],
      },
      {
        label: '选项',
        controlSetRows: [
          ['table_timestamp_format'],
          ['row_limit', 'page_length'],
          ['include_search', 'table_filter'],
        ],
      },
    ],
    controlOverrides: {
      metrics: {
        validators: [],
      },
      time_grain_sqla: {
        default: null,
      },
    },
  },

  markup: {
    label: '标记',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['markup_type'],
          ['code'],
        ],
      },
    ],
  },

  pivot_table: {
    label: '透视表',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby', 'columns'],
          ['metrics', 'pandas_aggfunc'],
        ],
      },
    ],
  },

  separator: {
    label: '分离器',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['code'],
        ],
      },
    ],
    controlOverrides: {
      code: {
        default: '####Section Title\n' +
        'A paragraph describing the section' +
        'of the dashboard, right before the separator line ' +
        '\n\n' +
        '---------------',
      },
    },
  },

  word_cloud: {
    label: '词汇云',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series', 'metric', 'limit'],
          ['size_from', 'size_to'],
          ['rotation'],
        ],
      },
    ],
  },

  treemap: {
    label: '树状图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['groupby'],
        ],
      },
      {
        label: '图表选项',
        controlSetRows: [
          ['treemap_ratio'],
          ['number_format'],
        ],
      },
    ],
  },

  cal_heatmap: {
    label: '日历热图',
    requiresTime: true,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['domain_granularity'],
          ['subdomain_granularity'],
        ],
      },
    ],
  },

  box_plot: {
    label: '箱线图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metrics'],
          ['groupby', 'limit'],
        ],
      },
      {
        label: '图表选项',
        controlSetRows: [
          ['whisker_options'],
        ],
      },
    ],
  },

  bubble: {
    label: '气泡图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series', 'entity'],
          ['x', 'y'],
          ['size', 'limit'],
        ],
      },
      {
        label: '图表选项',
        controlSetRows: [
          ['x_log_scale', 'y_log_scale'],
          ['show_legend'],
          ['max_bubble_size'],
          ['x_axis_label', 'y_axis_label'],
        ],
      },
    ],
  },

  bullet: {
    label: '子弹图',
    requiresTime: false,
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['ranges', 'range_labels'],
          ['markers', 'marker_labels'],
          ['marker_lines', 'marker_line_labels'],
        ],
      },
    ],
  },

  big_number: {
    label: '数字和趋势线',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['compare_lag'],
          ['compare_suffix'],
          ['y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
      },
    },
  },

  big_number_total: {
    label: '数字',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['metric'],
          ['subheader'],
          ['y_axis_format'],
        ],
      },
    ],
    controlOverrides: {
      y_axis_format: {
        label: '数字格式',
      },
    },
  },

  histogram: {
    label: '直方图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['all_columns_x'],
          ['row_limit'],
        ],
      },
      {
        label: '直方图选项',
        controlSetRows: [
          ['link_length'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: '数列',
        description: '选择数列以绘制直方图',
      },
      link_length: {
        label: '直条数量',
        description: '选择的直条数量',
        default: 5,
      },
    },
  },

  sunburst: {
    label: '环状层次图sunburst',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric', 'secondary_metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      metric: {
        label: '主指标',
        description: '主指标用于定义每一个扇片的弧段尺寸',
      },
      secondary_metric: {
        label: '子指标',
        description: '子指标用于定义相对主指标的颜色比例，当这两个指标相同时，该部分图像呈同一颜色',
      },
      groupby: {
        label: '层级',
        description: '定义该图的层级',
      },
    },
  },

  sankey: {
    label: '桑基图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '源/目标',
        description: '选择源和目标',
      },
    },
  },

  directed_force: {
    label: '力导向图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
      {
        label: '力学图',
        controlSetRows: [
          ['link_length'],
          ['charge'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '源/目标',
        description: '选择源和目标',
      },
    },
  },

  world_map: {
    label: '世界地图',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['entity'],
          ['country_fieldtype'],
          ['metric'],
        ],
      },
      {
        label: '气泡图',
        controlSetRows: [
          ['show_bubbles'],
          ['secondary_metric'],
          ['max_bubble_size'],
        ],
      },
    ],
    controlOverrides: {
      entity: {
        label: '国家控件',
        description: '国家的3个字母代码',
      },
      metric: {
        label: '色彩度量项',
        description: '代表该国家颜色度量值',
      },
      secondary_metric: {
        label: '气泡大小',
        description: '代表气泡大小的度量值',
      },
    },
  },

  search_box: {
    label: '搜索箱',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['date_filter', 'instant_filtering'],
          ['groupby'],
          ['metric'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '筛选控制',
        description: '筛选所使用的控制键',
        default: [],
      },
    },
  },

  filter_box: {
    label: '筛选箱',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['date_filter', 'instant_filtering'],
          ['groupby'],
          ['metric'],
          ['row_limit'],
        ],
      },
    ],
    controlOverrides: {
      groupby: {
        label: '筛选控制',
        description: '筛选所使用的控制键',
        default: [],
      },
    },
  },

  iframe: {
    label: '生成内嵌iframe',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['url'],
        ],
      },
    ],
  },

  para: {
    label: '平行坐标',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['series'],
          ['metrics'],
          ['secondary_metric'],
          ['limit'],
          ['show_datatable', 'include_series'],
        ],
      },
    ],
  },

  heatmap: {
    label: '热力图',
    controlPanelSections: [
      {
        label: '轴 & 度量',
        controlSetRows: [
          ['all_columns_x'],
          ['all_columns_y'],
          ['metric'],
        ],
      },
      {
        label: '热力图选项',
        controlSetRows: [
          ['linear_color_scheme'],
          ['xscale_interval', 'yscale_interval'],
          ['canvas_image_rendering'],
          ['normalize_across'],
        ],
      },
    ],
  },

  horizon: {
    label: '水平',
    controlPanelSections: [
      sections.NVD3TimeSeries[0],
      {
        label: '图表选项',
        controlSetRows: [
          ['series_height', 'horizon_color_scale'],
        ],
      },
    ],
  },

  mapbox: {
    label: 'Mapbox',
    controlPanelSections: [
      {
        label: null,
        controlSetRows: [
          ['all_columns_x', 'all_columns_y'],
          ['clustering_radius'],
          ['row_limit'],
          ['groupby'],
          ['render_while_dragging'],
        ],
      },
      {
        label: '点',
        controlSetRows: [
          ['point_radius'],
          ['point_radius_unit'],
        ],
      },
      {
        label: '标记',
        controlSetRows: [
          ['mapbox_label'],
          ['pandas_aggfunc'],
        ],
      },
      {
        label: '视觉调整',
        controlSetRows: [
          ['mapbox_style'],
          ['global_opacity'],
          ['mapbox_color'],
        ],
      },
      {
        label: '视窗',
        controlSetRows: [
          ['viewport_longitude'],
          ['viewport_latitude'],
          ['viewport_zoom'],
        ],
      },
    ],
    controlOverrides: {
      all_columns_x: {
        label: '经度',
        description: '表示经度的列',
      },
      all_columns_y: {
        label: '纬度',
        description: '表示纬度的列',
      },
      pandas_aggfunc: {
        label: '聚类标签聚集器 Cluster label aggregator',
        description: '使用聚合函数对每个节点进行聚类并打上标签',
      },
      rich_tooltip: {
        label: '提示',
        description: '鼠标放在数据节点和聚类上时显示的该标签的信息',
      },
      groupby: {
        description: '按照一个或多个字段分组。必须指定经度和纬度。',
      },
    },
  },
};

export default visTypes;

export function sectionsToRender(vizType, datasourceType) {
  const viz = visTypes[vizType];
  return [].concat(
    sections.datasourceAndVizType,
    (datasourceType === 'table' || datasourceType === 'es')
      ? sections.sqlaTimeSeries
      : sections.druidTimeSeries,
    viz.controlPanelSections,
    (datasourceType === 'table' || datasourceType === 'es') ? sections.sqlClause : [],
    (datasourceType === 'table' || datasourceType === 'es') ? sections.filters[0] : sections.filters,
  );
}

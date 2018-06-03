// JS
import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, ControlLabel } from 'react-bootstrap';
import Datetime from 'react-datetime';
import moment from 'moment';
import eventProxy from 'react-eventproxy';

import 'react-datetime/css/react-datetime.css';
import '../stylesheets/react-select/select.less';
import './filter_box.css';

require('moment/locale/zh-cn');

const propTypes = {
  origSelectedValues: React.PropTypes.object,
  instantFiltering: React.PropTypes.bool,
  filtersChoices: React.PropTypes.array,
  onChange: React.PropTypes.func,
  showDateFilter: React.PropTypes.bool,
};

const defaultProps = {
  origSelectedValues: {},
  onChange: () => {},
  showDateFilter: false,
  instantFiltering: true,
};

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValues: props.origSelectedValues,
      hasChanged: false,
    };
  }

  setDatetime(filter, dttm) {
    let d = null;
    if (moment.isMoment(dttm)) {
      d = moment(dttm).format('YYYY-MM-DD');
    }
    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[filter] = d;

    // 日期控件筛选时间
    if (filter === '__from') {
      setTimeout(() => {
        eventProxy.trigger('filter_start', d);
      }, 1000);
    }
    this.setState({ selectedValues, hasChanged: true });
    this.props.onChange(filter, d, false, this.props.instantFiltering);
    this.setState({ dttm: d }, this.onChange);
  }

  clickApply() {
    this.props.onChange('random_key', [Math.random()], true, true);
    this.setState({ hasChanged: false });
  }

  handleChange(opt, e) {
    const val = [];
    val.push(e.target.value);
    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[opt] = val;
    this.setState({ selectedValues, hasChanged: true });
    this.props.onChange(opt, val, false, this.props.instantFiltering);
  }

  render() {
    let dateFilter;
    if (this.props.showDateFilter) {
      const enDict = { __from: '开始日期', __to: '结束日期' };
      dateFilter = ['__from', '__to'].map(field =>
        (<div className="m-b-5" key={field}>
          {enDict[field]}
          <Datetime
            locale="zh-cn"
            timeFormat={false}
            closeOnSelect
            dateFormat="YYYY-MM-DD"
            inputProps={{ className: 'form-control input-sm' }}
            value={this.state.selectedValues[field]}
            onChange={this.setDatetime.bind(this, field)}
          /></div>)
      );
    }
    const inputStyle = {
      height: '34px',
      padding: '6px 12px',
    };
    const filterArr = this.props.filtersChoices;
    const filterOpt = filterArr.map((option) => {
      return (
        <div className="m-b-5" key={option}>
          <ControlLabel>{option}</ControlLabel>
          <FormControl
            type="text"
            style={inputStyle}
            placeholder={`请输入${option}`}
            value={this.state.selectedValues[option] || ''}
            onChange={this.handleChange.bind(this, option)}
          />
        </div>
      );
    });
    return (
      <div >
        {dateFilter}
        {filterOpt}
        {!this.props.instantFiltering &&
        <Button
          bsSize="small"
          bsStyle="primary"
          onClick={this.clickApply.bind(this)}
          disabled={!this.state.hasChanged}
        >
            查询
        </Button>
        }
      </div>
    );
  }
}

FilterBox.propTypes = propTypes;
FilterBox.defaultProps = defaultProps;

function filterBox(slice, payload) {
  const d3token = d3.select(slice.selector);
  d3token.selectAll('*').remove();

  const fd = slice.formData;

  ReactDOM.render(
    <FilterBox
      filtersChoices={fd.groupby}
      onChange={slice.addFilter}
      showDateFilter={fd.date_filter}
      origSelectedValues={slice.getFilters() || {}}
      instantFiltering={fd.instant_filtering}
    />,
    document.getElementById(slice.containerId),
  );
}

module.exports = filterBox;

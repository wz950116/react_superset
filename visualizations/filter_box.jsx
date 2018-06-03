// JS
import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
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
  filtersChoices: React.PropTypes.object,
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

  changeFilter(filter, options) {
    let vals = null;
    if (options) {
      if (Array.isArray(options)) {
        vals = options.map(opt => opt.value);
      } else {
        vals = options.value;
      }
    }

    const selectedValues = Object.assign({}, this.state.selectedValues);
    selectedValues[filter] = vals;
    this.setState({ selectedValues, hasChanged: true });
    this.props.onChange(filter, vals, false, this.props.instantFiltering);
  }

  clickApply() {
    this.props.onChange('random_key', [Math.random()], true, true);
    // this.props.onChange(Object.keys(this.state.selectedValues)[0], [], true, true);
    this.setState({ hasChanged: false });
  }

  render() {
    let dateFilter;
    if (this.props.showDateFilter) {
      const md = moment(moment().format('YYYY-MM-DD'));
      const valid = function (current) {
        return current < md;
      };
      const enDict = { __from: '开始日期', __to: '结束日期' };
      dateFilter = ['__from', '__to'].map(field =>
        (<div className="m-b-5" key={field} >
          {enDict[field]}
          <Datetime
            locale="zh-cn"
            timeFormat={false}
            closeOnSelect
            dateFormat="YYYY-MM-DD"
            inputProps={{ className: 'form-control input-sm' }}
            value={this.state.selectedValues[field]}
            onChange={this.setDatetime.bind(this, field)}
            isValidDate={valid}
          />
        </div >));
    }
    const filters = Object.keys(this.props.filtersChoices).map((filter) => {
      const data = this.props.filtersChoices[filter];
      const maxes = {};
      maxes[filter] = d3.max(data, function (d) {
        return d.metric;
      });
      return (
        <div key={filter} className="m-b-5" >
          {filter}
          <Select
            placeholder={`Select [${filter}]`}
            key={filter}
            multi
            value={this.state.selectedValues[filter]}
            options={data.map((opt) => {
              const perc = Math.round((opt.metric / maxes[opt.filter]) * 100);
              const backgroundImage = (
                'linear-gradient(to right, lightgrey, ' +
                `lightgrey ${perc}%, rgba(0,0,0,0) ${perc}%`
              );
              const style = {
                backgroundImage,
                padding: '2px 5px',
              };
              return { value: opt.id, label: opt.id, style };
            })}
            onChange={this.changeFilter.bind(this, filter)}
          />
        </div >
      );
    });
    return (
      <div >
        {dateFilter}
        {filters}
        {!this.props.instantFiltering &&
        <Button
          bsSize="small"
          bsStyle="primary"
          onClick={this.clickApply.bind(this)}
          disabled={!this.state.hasChanged}
        >
            查询
        </Button >
        }
      </div >
    );
  }
}

FilterBox.propTypes = propTypes;
FilterBox.defaultProps = defaultProps;

function filterBox(slice, payload) {
  const d3token = d3.select(slice.selector);
  d3token.selectAll('*').remove();

  // filter box should ignore the dashboard's filters
  // const url = slice.jsonEndpoint({ extraFilters: false });
  const fd = slice.formData;
  const filtersChoices = {};
  // Making sure the ordering of the fields matches the setting in the
  // dropdown as it may have been shuffled while serialized to json

  fd.groupby.forEach((f) => {
    filtersChoices[f] = payload.data[f];
  });
  ReactDOM.render(
    <FilterBox
      filtersChoices={filtersChoices}
      onChange={slice.addFilter}
      showDateFilter={fd.date_filter}
      origSelectedValues={slice.getFilters() || {}}
      instantFiltering={fd.instant_filtering}
    />,
    document.getElementById(slice.containerId),
  );
}

module.exports = filterBox;

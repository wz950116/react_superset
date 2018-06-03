import React from 'react';
import ReactDOM from 'react-dom';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import eventProxy from 'react-eventproxy';
import moment from 'moment';
import './CompareFilter.css';

require('moment/locale/zh-cn');

const filterKey = 'compare_start';
const propTypes = {
  maxDate: React.PropTypes.object,
  origCompreaStartDate: React.PropTypes.string,
  slice: React.PropTypes.object,
  // onChange: React.PropTypes.func,
};

const defaultProps = {
  maxDate: {},
  origCompreaStartDate: {},
  slice: {},
  // onChange: () => {},
};

class CompareFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasChanged: false,
      compreaStartDate: props.origCompreaStartDate,
      maxDate: props.maxDate,
    };
  }

  componentDidMount() {
    // 监听 filter_start 事件
    eventProxy.on('filter_start', (filterStart) => {
      this.setState({ maxDate: moment(filterStart) });
    });
  }

  setDatetime(dttm) {
    let d = null;
    if (moment.isMoment(dttm)) {
      d = moment(dttm).format('YYYY-MM-DD');
    }

    // const selectedValues = Object.assign({}, this.state.compreaStartDate);
    // selectedValues[filter] = d;
    this.setState({ compreaStartDate: d, hasChanged: true });
    this.props.slice.addFilter(filterKey, d, true, false, false);
    if (this.props.slice.render) {
      this.props.slice.render(false);
    }
    // this.props.onChange(filterKey, d, false, true);
    // this.setState({ compreaStartDate: d }, this.onChange);
  }

  render() {
    const md = this.state.maxDate;
    const valid = function (current) {
      return current < md;
    };

    const compareDateCtlId = 'compare_date_ctl_' +
      this.props.slice.formData.slice_id;
    return (<div >
      <label
        htmlFor={compareDateCtlId}
      >同比开始日期：</label >
      <Datetime
        id={compareDateCtlId}
        locale="zh-cn"
        timeFormat={false}
        closeOnSelect
        dateFormat="YYYY-MM-DD"
        className={'compare-date'}
        isValidDate={valid}
        inputProps={{ className: 'form-control input-sm' }}
        onChange={this.setDatetime.bind(this)}
        value={this.state.compreaStartDate}
      />
    </div >);
  }
}

CompareFilter.propTypes = propTypes;
CompareFilter.defaultProps = defaultProps;

function compareFilter(slice, payload) {
  const extraFilters = payload.form_data.extra_filters;
  let mDate = moment().subtract(29, 'days');
  let compareSD = '';
  for (const i in extraFilters) {
    if (extraFilters[i].col === 'compare_start') {
      compareSD = extraFilters[i].val;
    }
    if (extraFilters[i].col === '__from') {
      mDate = moment(extraFilters[i].val);
    }
  }
  ReactDOM.render(
    <CompareFilter
      // onChange={slice.addFilter}
      slice={slice}
      origCompreaStartDate={compareSD}
      maxDate={mDate}
    />,
    document.getElementById(slice.containerId),
  );
}

module.exports = compareFilter;

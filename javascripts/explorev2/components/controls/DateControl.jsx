import React, { PropTypes } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';

require('moment/locale/zh-cn');

const propTypes = {
  format: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.date]),
};
const defaultProps = {
  label: null,
  onChange: () => {},
};

export default class DateControl extends React.PureComponent {
  constructor(props) {
    super(props);
    const fmt = this.props.format ? this.props.format : 'YYYY-MM-DD';
    let v = props.value;
    switch (v) {
      case '7 days ago':
        v = moment().subtract(7, 'day').format(fmt);
        break;
      case 'now':
        v = moment().format(fmt);
        break;
      default :
        break;
    }

    this.state = {
      value: v,
      format: fmt,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    if (moment.isMoment(value)) {
      this.setState({ value: value.format(this.state.format) }, this.onChange);
      this.props.onChange(this.state.value);
    }
  }

  render() {
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    return (
      <div >
        <Datetime
          locale="zh-cn"
          timeFormat={false}
          closeOnSelect
          dateFormat="YYYY-MM-DD"
          inputProps={{ className: 'form-control input-sm' }}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
        />
      </div >
    );
  }
}

DateControl.propTypes = propTypes;
DateControl.defaultProps = defaultProps;

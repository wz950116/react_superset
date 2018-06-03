import React from 'react';
import {Link} from 'react-router';
import $ from 'jquery';

class LeftSider extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      listItems: ""
    };
  }

  componentDidMount() {
    const _this = this;
    let modelView = 'DashboardModelViewAsync', orderCol = 'dashboard_groups.group_id,dashboard_title', order = 'asc';
    let url = '/' + modelView.toLowerCase() + '/api/read';
    url += '?_oc_' + modelView + '=' + orderCol;
    url += '&_od_' + modelView + '=' + order;
    $.getJSON(url, data => {
      const groupTree = {};
      for (let i = 0; i < data.result.length; i++) {
        const d = data.result[i];
        let groupName = d.groups_name;
        if (groupName.length === 0) groupName = '其他';
        if (groupTree[groupName]) {
          groupTree[groupName].list.push(d);
          if (groupTree[groupName].is_redpoint === false &&
                        d.is_redpoint === true) {
            groupTree[groupName].is_redpoint = d.is_redpoint;
          }
        } else {
          groupTree[groupName] = { is_redpoint: d.is_redpoint, list: [d] };
        }
      }
      const groupList = Object.keys(groupTree);
      const listItems = groupList.map((group, index) => (
        <li className="" key={index}>
          <a style={{ fontSize: '1.11em' }}>
            <i className="fa fa-bar-chart" />
            {group}
            {groupTree[group].is_redpoint
              ? <div className="bg-red" >&nbsp;</div>
              : ''}
            <span className="fa fa-chevron-right" />
          </a>

          <ul className="nav child_menu" style={{ display: 'none' }}>
            {groupTree[group].list.map((m, i) =>
              (<li key={i}>
                <Link to={m.url}>
                  {m.dashboard_title}
                  {m.is_redpoint ? <div className="bg-red" >&nbsp;</div > : ''}
                </Link>
              </li>)
            )}
          </ul>
        </li>
      ));
      this.setState({listItems});

      // click first title
      $('#sidebar-menu .side-menu>li').children('a').on('click', function() {
        $('#sidebar-menu').find('span.fa').removeClass('fa-chevron-down');
        const $li = $(this).parent();
        if ($li.is('.active')) {
          $li.removeClass('active active-sm');
          $('ul:first', $li).slideUp(function () {
            setContentHeight();
          });
        } else {
          $('#sidebar-menu').find('li').removeClass('active active-sm');
          $('#sidebar-menu').find('li ul').slideUp();
          $li.children('ul').slideDown(function () {
            setContentHeight();
          }).parent().addClass('active').find('span.fa').addClass('fa-chevron-down');
        }
      });
      // click second title
      $('#sidebar-menu .side-menu>li').find('ul a').on('click', function() {
        const $li = $(this).parent();
        $li.addClass('active');
        // emit message
        if ($(this).attr("href")) {
          $li.addClass('active current-page').
            siblings('li').
            removeClass('active current-page');
          let url = $(this).attr("href").replace(/dashboard/g, 'bootstrap_data');
          $.getJSON(url, function (data) {
            let dashboardData = JSON.parse(data.data);
            _this.props.onchange(dashboardData);
          });
        }
      });

      // check active menu
      let activeMenu = $('#sidebar-menu').find('a[href="' + CURRENT_URL + '"]');
      if (activeMenu.length === 0) {
        activeMenu = $('#sidebar-menu').find('a:first');
        activeMenu.parent('li').
          addClass('current-page').
          find('ul:first').
          slideDown(function () {
            setContentHeight();
          }).
          parent().
          addClass('active').
          children('a').
          find('span.fa').
          addClass('fa-chevron-down');
        // init Ajax
        let url = CURRENT_URL.replace(/dashboard/g, 'bootstrap_data');
        $.getJSON(url, function (data) {
          let dashboardData = JSON.parse(data.data);
          // emit to Father Component
          _this.props.onchange(dashboardData);
        });
      } else {
        activeMenu.parent('li').
          addClass('current-page').
          parents('ul').
          slideDown(function () {
            setContentHeight();
          }).
          parent().
          addClass('active').
          children('a').
          find('span.fa').
          addClass('fa-chevron-down');
        activeMenu.trigger('click');
      }
    });
  }

  render(){
    return(
      <div id="sidebar-menu" className="collapse in col-sm-3 col-md-2 sidebar-nav left_col" role="navigation">
        <ul className="nav side-menu">
          {this.state.listItems}
        </ul>
      </div>
    )
  }
}

export default LeftSider;
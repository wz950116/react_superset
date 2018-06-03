import React from 'react';
import { render } from 'react-dom';
import d3 from 'd3';
import { Alert } from 'react-bootstrap';
import moment from 'moment';
import $ from 'jquery';

import Header from './Header';
import GridLayout from './GridLayout';
import LeftSider from './LeftSider';
import { appSetup } from '../../common';

const px = require('../../modules/superset');
const urlLib = require('url');
const utils = require('../../modules/utils');

import '../../../stylesheets/dashboard.css';

appSetup();

function getInitialState(boostrapData) {
  const dashboard = Object.assign({}, utils.controllerInterface,
    boostrapData.dashboard_data);
  dashboard.firstLoad = true;

  dashboard.posDict = {};
  if (dashboard.position_json) {
    dashboard.position_json.forEach((position) => {
      dashboard.posDict[position.slice_id] = position;
    });
  }
  dashboard.refreshTimer = null;
  const state = Object.assign({}, boostrapData, { dashboard });
  return state;
}

function unload() {
  const message = 'You have unsaved changes.';
  window.event.returnValue = message; // Gecko + IE
  return message; // Gecko + Webkit, Safari, Chrome etc.
}

function onBeforeUnload(hasChanged) {
  if (hasChanged) {
    window.addEventListener('beforeunload', unload);
  } else {
    window.removeEventListener('beforeunload', unload);
  }
}

function renderAlert() {
  if ($('#alert-container').length === 0) return;  // not find DOM Element
  render(
    <div className="container-fluid" >
      <Alert bsStyle="warning" >
        <strong >You have unsaved changes.</strong > Click the&nbsp;
        <i className="fa fa-save" />
        &nbsp;
                                                     button on the top right to save your changes.
      </Alert >
    </div >,
    document.getElementById('alert-container'),
  );
}

function initDashboardView(dashboard) {
  render(
    <Header dashboard={dashboard} />,
    document.getElementById('dashboard-header'),
  );
  // eslint-disable-next-line no-param-reassign
  dashboard.reactGridLayout = render(
    <GridLayout dashboard={dashboard} />,
    document.getElementById('grid-container'),
  );

  // Displaying widget controls on hover
  $('.react-grid-item').hover(
    function () {
      $(this).find('.chart-controls').fadeIn(300);
    },
    function () {
      $(this).find('.chart-controls').fadeOut(300);
    },
  );
  $('div.grid-container').css('visibility', 'visible');

  $('div.widget').click(function (e) {
    const $this = $(this);
    const $target = $(e.target);

    if ($target.hasClass('slice_info')) {
      $this.find('.slice_description').slideToggle(0, function () {
        $this.find('.refresh').click();
      });
    } else if ($target.hasClass('controls-toggle')) {
      $this.find('.chart-controls').toggle();
    }
  });
  px.initFavStars();
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
}

function dashboardContainer(dashboard, datasources) {
  return Object.assign({}, dashboard, {
    type: 'dashboard',
    filters: {},
    init() {
      this.sliceObjects = [];
      dashboard.slices.forEach((data) => {
        if (data.error) {
          const html = `<div class="alert alert-danger">${data.error}</div>`;
          $(`#slice_${data.slice_id}`).find('.token').html(html);
        } else {
          const slice = px.Slice(data, datasources[data.form_data.datasource],
            this);
          $(`#slice_${data.slice_id}`).find('a.refresh').click(() => {
            slice.render(true);
          });
          this.sliceObjects.push(slice);
        }
      });
      this.loadPreSelectFilters();
      this.startPeriodicRender(0);
      // this.bindResizeToWindowResize();
    },
    onChange() {
      onBeforeUnload(true);
      renderAlert();
    },
    onSave() {
      onBeforeUnload(false);
      $('#alert-container').html('');
    },
    loadPreSelectFilters() {
      try {
        const filters = JSON.parse(px.getParam('preselect_filters') || '{}');
        for (const sliceId in filters) {
          for (const col in filters[sliceId]) {
            this.setFilter(sliceId, col, filters[sliceId][col], false, false);
          }
        }
      } catch (e) {
        // console.error(e);
      }
    },
    setFilter(sliceId, col, vals, refresh) {
      this.addFilter(sliceId, col, vals, false, refresh);
    },
    done(slice) {
      const refresh = slice.getWidgetHeader().find('.refresh');
      const data = slice.data;
      const cachedWhen = moment.utc(data.cached_dttm).fromNow();
      if (data !== undefined && data.is_cached) {
        refresh.addClass('danger').attr(
          'title',
          `Served from data cached ${cachedWhen}. ` +
          'Click to force refresh').tooltip('fixTitle');
      } else {
        refresh.removeClass('danger')
          .attr('title', 'Click to force refresh')
          .tooltip('fixTitle');
      }
    },
    effectiveExtraFilters(sliceId) {
      const f = [];
      const immuneSlices = this.metadata.filter_immune_slices || [];
      if (sliceId && immuneSlices.includes(sliceId)) {
        // The slice is immune to dashboard fiterls
        return f;
      }

      // Building a list of fields the slice is immune to filters on
      let immuneToFields = [];
      if (
        sliceId &&
        this.metadata.filter_immune_slice_fields &&
        this.metadata.filter_immune_slice_fields[sliceId]) {
        immuneToFields = this.metadata.filter_immune_slice_fields[sliceId];
      }
      for (const filteringSliceId in this.filters) {
        for (const field in this.filters[filteringSliceId]) {
          if (!immuneToFields.includes(field)) {
            f.push({
              col: field,
              op: 'in',
              val: this.filters[filteringSliceId][field],
            });
          }
        }
      }
      return f;
    },
    addFilter(
      sliceId, col, vals, merge = true, refresh = true, addToUrl = true) {
      if (!(sliceId in this.filters)) {
        this.filters[sliceId] = {};
      }
      if (addToUrl) {
        if (!(col in this.filters[sliceId]) || !merge) {
          this.filters[sliceId][col] = vals;
        } else {
          this.filters[sliceId][col] = d3.merge(
            [this.filters[sliceId][col], vals]);
        }
      } else {
        if (!(col in this.filters)) {
          this.filters[col] = {};
        }
        this.filters[col][col] = vals;
      }

      if (refresh) {
        this.refreshExcept(sliceId);
      }
      if (addToUrl) {
        this.updateFilterParamsInUrl();
      }
    },
    readFilters() {
      // Returns a list of human readable active filters
      return JSON.stringify(this.filters, null, '  ');
    },
    updateFilterParamsInUrl() {
      const urlObj = urlLib.parse(location.href, true);
      urlObj.query = urlObj.query || {};
      urlObj.query.preselect_filters = this.readFilters();
      urlObj.search = null;
      history.pushState(urlObj.query, window.title, urlLib.format(urlObj));
    },
    bindResizeToWindowResize() {
      let resizeTimer;
      const dash = this;
      $(window).on('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          dash.sliceObjects.forEach((slice) => {
            slice.resize();
          });
        }, 500);
      });
    },
    stopPeriodicRender() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
    startPeriodicRender(interval) {
      this.stopPeriodicRender();
      const dash = this;
      const maxRandomDelay = Math.max(interval * 0.2, 5000);
      const refreshAll = () => {
        dash.sliceObjects.forEach((slice) => {
          const force = !dash.firstLoad;
          setTimeout(
            () => {
              slice.render(force);
            },
            // Randomize to prevent all widgets refreshing at the same time
            maxRandomDelay * Math.random());
        });
        dash.firstLoad = false;
      };

      const fetchAndRender = function () {
        refreshAll();
        if (interval > 0) {
          dash.refreshTimer = setTimeout(function () {
            fetchAndRender();
          }, interval);
        }
      };
      fetchAndRender();
    },
    refreshExcept(sliceId) {
      const immune = this.metadata.filter_immune_slices || [];
      this.sliceObjects.forEach((slice) => {
        if (slice.data.slice_id !== sliceId &&
          immune.indexOf(slice.data.slice_id) === -1) {
          slice.render();
          const sliceSeletor = $(`#${slice.data.slice_id}-cell`);
          sliceSeletor.addClass('slice-cell-highlight');
          setTimeout(function () {
            sliceSeletor.removeClass('slice-cell-highlight');
          }, 1200);
        }
      });
    },
    clearFilters(sliceId) {
      delete this.filters[sliceId];
      this.refreshExcept(sliceId);
      this.updateFilterParamsInUrl();
    },
    removeFilter(sliceId, col, vals) {
      if (sliceId in this.filters) {
        if (col in this.filters[sliceId]) {
          const a = [];
          this.filters[sliceId][col].forEach(function (v) {
            if (vals.indexOf(v) < 0) {
              a.push(v);
            }
          });
          this.filters[sliceId][col] = a;
        }
      }
      this.refreshExcept(sliceId);
      this.updateFilterParamsInUrl();
    },
    getSlice(sliceId) {
      const id = parseInt(sliceId, 10);
      let i = 0;
      let slice = null;
      while (i < this.sliceObjects.length) {
        // when the slice is found, assign to slice and break;
        if (this.sliceObjects[i].data.slice_id === id) {
          slice = this.sliceObjects[i];
          break;
        }
        i++;
      }
      return slice;
    },
    getAjaxErrorMsg(error) {
      const respJSON = error.responseJSON;
      return (respJSON && respJSON.message)
        ? respJSON.message
        : error.responseText;
    },
    addSlicesToDashboard(sliceIds) {
      const getAjaxErrorMsg = this.getAjaxErrorMsg;
      $.ajax({
        type: 'POST',
        url: `/superset/add_slices/${dashboard.id}/`,
        data: {
          data: JSON.stringify({ slice_ids: sliceIds }),
        },
        success() {
          // Refresh page to allow for slices to re-render
          window.location.reload();
        },
        error(error) {
          const errorMsg = getAjaxErrorMsg(error);
          utils.showModal({
            title: 'Error',
            body: 'Sorry, there was an error adding slices to this dashboard: </ br>' +
            errorMsg,
          });
        },
      });
    },
  });
}

class Layout extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  rightContent(dashboardData) {
    const state = getInitialState(dashboardData);
    const dashboard = dashboardContainer(state.dashboard, state.datasources);
    initDashboardView(dashboard);
    dashboard.init();
  }

  render() {
    return (
      <div>
        <LeftSider onchange={this.rightContent}/>
        <div id="box-content" className="col-sm-9 col-md-10 right_col">
          <div
            className="dashboard container-fluid"
            data-bootstrap="{{ bootstrap_data }}"
          >
            <div id="dashboard-header"></div>
            <div id="grid-container" className="slice-grid gridster"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Layout;
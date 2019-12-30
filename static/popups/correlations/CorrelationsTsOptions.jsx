import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";

class CorrelationsTsOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { window: props.window };
    this.changeDate = this.changeDate.bind(this);
    this.renderDescription = this.renderDescription.bind(this);
    this.renderRollingWindow = this.renderRollingWindow.bind(this);
    this.renderDateDropdown = this.renderDateDropdown.bind(this);
    this.changeDate = this.changeDate.bind(this);
  }

  changeDate(evt) {
    this.props.buildTs(this.props.selectedCols, evt.target.value, this.props.rolling ? this.state.window : null);
  }

  renderDescription() {
    const { selectedCols, rolling, window } = this.props;
    let description = `Timeseries of Pearson Correlation for ${selectedCols[0]} vs. ${selectedCols[1]}`;
    if (rolling) {
      description = `Rolling Pearson Correlation (window: ${window}) for ${selectedCols[0]} vs. ${selectedCols[1]}`;
    }
    let clicker = (
      <div>
        <small>(Click on any point in the chart to view the scatter plot of that correlation)</small>
      </div>
    );
    if (rolling) {
      clicker = null;
    }
    return (
      <div className="col">
        <div>
          <b>{description}</b>
        </div>
        {clicker}
      </div>
    );
  }

  renderRollingWindow() {
    const updateWindow = window => {
      this.setState({ window }, () => {
        if (window && parseInt(window)) {
          this.props.buildTs(this.props.selectedCols, this.props.selectedDate, parseInt(window));
        }
      });
    };
    return [
      <label key="rolling-label" className="col-form-label text-right pl-5">
        Rolling Window
      </label>,
      <div key="rolling-input" style={{ width: "3em" }}>
        <input
          type="text"
          className="form-control"
          value={this.state.window}
          onChange={event => updateWindow(event.target.value)}
        />
      </div>,
    ];
  }

  renderDateDropdown() {
    const { dates, selectedDate } = this.props;
    return [
      <label key="date-label" className="col-form-label text-right">
        Date Column
      </label>,
      <div key="date-input">
        <select className="form-control custom-select" defaultValue={selectedDate} onChange={this.changeDate}>
          {_.map(dates, d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>,
    ];
  }

  render() {
    const { hasDate, selectedCols } = this.props;
    if (!hasDate) {
      return null;
    }
    if (_.isEmpty(selectedCols)) {
      return null;
    }
    return (
      <div className="row pt-5">
        {this.renderDescription()}
        <div className="col-auto">
          <div className="form-group row small-gutters float-right pr-3">
            {_.size(this.props.dates) > 1 && this.renderDateDropdown()}
            {this.props.rolling && this.renderRollingWindow()}
          </div>
        </div>
      </div>
    );
  }
}
CorrelationsTsOptions.displayName = "CorrelationsTsOptions";
CorrelationsTsOptions.propTypes = {
  hasDate: PropTypes.bool,
  rolling: PropTypes.bool,
  dates: PropTypes.arrayOf(PropTypes.string),
  selectedCols: PropTypes.arrayOf(PropTypes.string),
  selectedDate: PropTypes.string,
  window: PropTypes.number,
  buildTs: PropTypes.func,
};

export default CorrelationsTsOptions;
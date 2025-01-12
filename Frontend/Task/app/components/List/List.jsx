import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Filter from '../Filter/Filter';

import * as actions from '../../actions/currencyActions';

import styles from './list.css';

class List extends React.Component {
  handleChange = (key) => {
    const { filter } = this.props;
    filter(key);
  };

  renderContent = () => {
    const { rates } = this.props;
    return (
      <div>{rates.length > 0 ? this.renderRates() : this.renderLoading()}</div>
    );
  };

  renderError = () => {
    const { rates } = this.props;
    if (rates.length === 0) {
      return (
        <div className="loading">Something Went Wrong with the fetch API.</div>
      );
    }
    return (
      <div>
        <h2 className={styles.h2}>
          Something Went Wrong with the fetch API, showing you the old rates if
          we have any...
        </h2>
        {this.renderRates()}
      </div>
    );
  };

  renderRates = () => {
    const { rates, timestamp, rateId } = this.props;
    const rateToShow = rates.filter((item) => item.id === rateId);
    return (
      <>
        <h3 className={styles.h3}>
          Last Fetched at:
          {timestamp}
        </h3>
        <Filter selectOptions={rates} onSelectOptions={this.handleChange} />
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Old Value</th>
              <th className={styles.th}>Value</th>
              <th className={styles.th}>Type</th>
            </tr>
          </thead>
          <tbody>
            {rateToShow.length > 0
              ? this.renderRate(rateToShow)
              : this.renderRate(rates)}
          </tbody>
        </table>
      </>
    );
  };

  renderRate = (rates) => rates.map((rate) => (
    <tr key={rate.id}>
        <td className={styles.td}>{rate.name}</td>
        <td className={styles.td}>{rate.oldValue}</td>
        <td className={styles.td}>{rate.value}</td>
        <td className={styles.td}>{rate.type}</td>
      </tr>
    ));

  renderLoading = () => {
    const { status } = this.props;
    return (
      <div>
        {status !== 200 ? (
          this.renderError()
        ) : (
          <div className="loading">Loading Rates...</div>
        )}
      </div>
    );
  };

  render() {
    const { isLoadingRates, status, isLoadingConfiguration } = this.props;
    return (
      <div className="wrapper" data-test="listComponent">
        {(isLoadingRates === true && isLoadingConfiguration === true)
        || status !== 200
          ? this.renderLoading()
          : this.renderContent()}
      </div>
    );
  }
}

List.propTypes = {
  rates: PropTypes.array,
  filter: PropTypes.func,
  isLoadingConfiguration: PropTypes.bool,
  isLoadingRates: PropTypes.bool,
  status: PropTypes.number,
  timestamp: PropTypes.string,
};

List.defaultProps = {
  rates: [],
  status: 200,
  isLoadingConfiguration: true,
  isLoadingRates: true,
  timestamp: '',
};

const mapStateToProps = (state) => ({
  rateId: state.CurrencyReducer.rateId,
});

const mapDispatchToProps = (dispatch) => ({
  filter: (rateId) => {
    dispatch(actions.filter(rateId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(List);

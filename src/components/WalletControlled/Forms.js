import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputValor from './InputValor';
import InputDescricao from './InputDescricao';
import SelectMoeda from './SelectMoeda';
import SelectMetodoPagto from './SelectMetodoPagto';
import SelectCategoria from './SelectCategoria';
import ButtonAddDespesa from './ButtonAddDespesa';
import { fetchAPI } from '../../actions/getApiCoins';
import { addDataForms } from '../../actions';

class Forms extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.exchangeRates = this.exchangeRates.bind(this);
    this.increaseCounter = this.increaseCounter.bind(this);
    this.resetData = this.resetData.bind(this);

    this.state = {
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      counter: 0,
    };
  }

  componentDidMount() {
    const { getCoins } = this.props;
    getCoins();
  }

  exchangeRates() {
    const { props: { coins } } = this;
    coins.reduce(
      (accumulator, coin) => ({
        ...accumulator,
        [coin[0]]: coin[1],
      }),
      {},
    );
  }

  handleChange({ target: { name, type, value, checked } }) {
    function newValue() {
      switch (type) {
      case 'checkbox': return checked;
      case 'number': return +value;
      default: return value;
      }
    }
    this.setState((state) => ({ ...state, [name]: newValue() }));
  }

  async handleClick() {
    const {
      state: { value, description, currency, method, tag, counter },
      props: { getCoins, addFormsStore, coins },
      increaseCounter,
      resetData,
    } = this;

    await getCoins();

    const dataForm = {
      id: counter,
      value: `${value}`,
      description,
      currency,
      method,
      tag,
      exchangeRates: coins,
    };

    addFormsStore(dataForm);
    increaseCounter();
    resetData();
  }

  increaseCounter() {
    const {
      state: { counter },
    } = this;

    this.setState((state) => ({
      ...state,
      counter: counter + 1,
    }));
  }

  resetData() {
    this.setState((state) => ({
      ...state,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    }));
  }

  render() {
    const {
      state: { value, description, currency, method, tag },
      handleChange,
      handleClick,
    } = this;
    return (
      <form>
        <InputValor
          value={ value }
          handleChange={ handleChange }
        />
        <InputDescricao
          value={ description }
          handleChange={ handleChange }
        />
        <SelectMoeda
          value={ currency }
          handleChange={ handleChange }
        />
        <SelectMetodoPagto
          value={ method }
          handleChange={ handleChange }
        />
        <SelectCategoria
          value={ tag }
          handleChange={ handleChange }
        />
        <ButtonAddDespesa
          handleClick={ handleClick }
        />
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getCoins: () => dispatch(fetchAPI()),
  addFormsStore: (state) => dispatch(addDataForms(state)),
});

const mapStateToProps = (state) => ({
  coins: state.wallet.currencies,
});

const { func, array } = PropTypes;
Forms.propTypes = {
  getCoins: func.isRequired,
  addFormsStore: func.isRequired,
  coins: array.isRequired,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Forms);

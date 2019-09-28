import { expect } from 'chai';

import {
  getInitialState,
  updateCountries,
  updateCountry,
  deleteCountry,
} from './reducer';
import * as actions from './actions';
import makeStore from './index';
import countries from '../configs/country';

describe('Country reducer - ', () => {
  describe('getInitialState()', () => {
    it('should return empty country list', () => {
      const result = getInitialState();
      expect(result.hasOwnProperty('countries')).to.be.true;
      expect(result.countries.length).to.equal(0);
    });
  });

  describe('updateCountries()', () => {
    it('should insert countries into state', () => {
      let action = { countries: ['a', 'b', 'c'] };
      let result = updateCountries(getInitialState(), action);
      expect(result.countries.length).to.equal(3);

      action = { countries: ['d', 'e'] };
      result = updateCountries(getInitialState(), action);
      expect(result.countries.length).to.equal(2);
    });

    it('should keep other state props', () => {
      const action = { countries: ['a', 'b', 'c'] };
      const result = updateCountries({ foo: 'bar' }, action);
      expect(result.foo).to.equal('bar');
    });
  });

  describe('updateCountry()', () => {
    it('should update correct country', () => {
      let state = getInitialState();
      
      //  insert mock data into state
      const countriesSample = countries.slice(0, 5); 
      state = updateCountries(state, { countries: countriesSample });
      expect(state.countries.length).to.equal(5);

      //  modify one of the countries, making shallow copy first
      let modifiedCountry = {...countriesSample[2]};
      modifiedCountry.population = 200;
      let action = { country: modifiedCountry };
      state = updateCountry(state, action)
      expect(state.countries[2].population).to.equal(200);
      expect(state.countries.length).to.equal(5);

      //  make sure the not update props are kept
      modifiedCountry = {...state.countries[2]};
      delete modifiedCountry.population;
      modifiedCountry.foo = 'bar';
      action = { country: modifiedCountry };
      state = updateCountry(state, action)
      expect(state.countries[2].foo).to.equal('bar');
      expect(state.countries[2].population).to.equal(200);
      expect(state.countries.length).to.equal(5);
    });
  });

  describe('deleteCountry()', () => {
    it('should delete correct country', () => {
      let state = getInitialState();

      //  insert mock data into state
      const countriesSample = countries.slice(0, 5); 
      state = updateCountries(state, { countries: countriesSample });
      expect(state.countries.length).to.equal(5);

      let removeCountry = countriesSample[2];
      let action = { country: removeCountry };
      state = deleteCountry(state, action);
      expect(state.countries.length).to.equal(4);

      removeCountry = countriesSample[1];
      action = { country: removeCountry };
      state = deleteCountry(state, action);
      expect(state.countries.length).to.equal(3);

      //  should ignore invalid data
      removeCountry = {foo: 'bar'};
      action = { country: removeCountry };
      state = deleteCountry(state, action);
      expect(state.countries.length).to.equal(3);
    });
  });

  describe('reduce()', () => {
    let store;

    beforeEach(() => {
      store = makeStore();
    });

    it('should handle UPDATE_COUNTRIES', () => {
      //  insert mock data into state
      let countriesSample = countries.slice(0, 5); 
      let action = actions.updateCountries(countriesSample);
      store.dispatch(action);

      let state = store.getState();
      expect(state.countries.length).to.equal(5);

      countriesSample = countries.slice(15, 115); 
      action = actions.updateCountries(countriesSample);
      store.dispatch(action);

      state = store.getState();
      expect(state.countries.length).to.equal(100);
    });

    it('should handle UPDATE_COUNTRY', () => {
      //  insert mock data into state
      let countriesSample = countries.slice(0, 5); 
      let action = actions.updateCountries(countriesSample);
      store.dispatch(action);

      let state = store.getState();
      expect(state.countries.length).to.equal(5);

      let modifiedCountry = {...countriesSample[2]};
      modifiedCountry.population = 200;
      action = actions.updateCountry(modifiedCountry);
      store.dispatch(action);
      state = store.getState();
      expect(state.countries[2].population).to.equal(200);

      modifiedCountry = {...countriesSample[3]};
      modifiedCountry.population = 300;
      action = actions.updateCountry(modifiedCountry);
      store.dispatch(action);
      state = store.getState();
      expect(state.countries[2].population).to.equal(200);
      expect(state.countries[3].population).to.equal(300);
    });

    it('should handle DELETE_COUNTRY', () => {
      //  insert mock data into state
      let countriesSample = countries.slice(0, 5); 
      let action = actions.updateCountries(countriesSample);
      store.dispatch(action);

      let state = store.getState();
      expect(state.countries.length).to.equal(5);

      let removeCountry = countriesSample[2];
      action = actions.deleteCountry(removeCountry);
      store.dispatch(action);
      state = store.getState();
      expect(state.countries.length).to.equal(4);

      removeCountry = countriesSample[3];
      action = actions.deleteCountry(removeCountry);
      store.dispatch(action);
      state = store.getState();
      expect(state.countries.length).to.equal(3);

      //  cannot remove the same country twice
      removeCountry = countriesSample[3];
      action = actions.deleteCountry(removeCountry);
      store.dispatch(action);
      state = store.getState();
      expect(state.countries.length).to.equal(3);
    });
  });
})
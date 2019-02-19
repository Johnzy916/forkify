import axios from 'axios';
import { key } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const get = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = get.data.recipes;
//      console.log(this.result);
    } catch(error) {
      console.log(error);
    }
  }
}

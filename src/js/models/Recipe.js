import axios from 'axios';
import { key } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      alert(`Oops, Something went wrong :(\n${error}`);
    }
  }

  calcTime() {
    // assuming we need 15 minutes for each 3 ingredients.
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'pound'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb', 'lb'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(el => {
      // uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // there IS a unit found
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          // count = parseFloat(eval((arrIng[0]).replace('-', '+')).toString().split('').slice(0, 4).join(''));
          count = eval((arrIng[0]).replace('-', '+'));

        } else {
          // count = parseFloat(eval(arrIng.slice(0, unitIndex).join('+')).toString().split('').slice(0, 4).join(''));
          count = eval(arrIng.slice(0, unitIndex).join('+'));

        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if (parseInt(arrIng[0], 10)) {
        // there is NO unit, but 1st element IS a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }

      } else if (unitIndex === -1) {
        // there is NO unit & NO number in first position
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }
      return objIng;

    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    this.ingredients.forEach(ing => {
      ing.count *= (newServings / this.servings);
    });

    // ingredients
    this.servings = newServings;


  }

};

import localStorage from './localStorage.js';

// localStorage.set('name', 'nan');
// localStorage.set('age', 18, 60 * 1000);

let oo = {
  a: 1,
  b: {
    a: 1,
  },
};
localStorage.set('obj', oo, 60 * 1000);

oo.b.a = 2;

let a = localStorage.get('obj');
console.log(a);

console.log(oo);

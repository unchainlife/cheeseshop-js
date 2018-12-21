const uuid = require('uuid/v4');
const { fromJS } = require('immutable');

function Product(id = uuid()) {
  let _state = fromJS({
    id,
  });

  this.getId = () => _state.id;
}

module.exports = Product;

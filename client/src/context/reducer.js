export const initialState = {
  user: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  shipping_info: JSON.parse(localStorage.getItem("shipping")) || {},
  order_info: JSON.parse(localStorage.getItem("order_info")) || {},
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "set_user":
      return {
        ...state,
        user: payload.user,
      };

    case "add_to_cart": {
      const { item, quantity } = payload;
      const existingItem = state.cart.find((p) => p.id === item.id);
      let cart;

      if (existingItem) {
        cart = state.cart.map((i) =>
          i.id === item.id
            ? { ...existingItem, quantity: existingItem.quantity + quantity }
            : i
        );
      } else {
        cart = [...state.cart, { ...item, quantity }];
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      return { ...state, cart };
    }

    case "remove_from_cart": {
      const { item } = payload;

      const newCart = [...state.cart];
      const idx = state.cart.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        newCart.splice(idx, 1);
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }

    case "update_shipping_info": {
      const { shipping } = payload;
      localStorage.setItem("shipping", JSON.stringify(shipping));
      return { ...state, shipping_info: shipping };
    }

    case "update_order_info": {
      const { order_info } = payload;
      localStorage.setItem("order_info", JSON.stringify(order_info));
      return { ...state, order_info };
    }

    case "reset_state": {
      return { ...state, shipping_info: {}, cart: [], order_info: {} };
    }

    default:
      return state;
  }
};

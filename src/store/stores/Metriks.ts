declare global {
  interface Window {
    _tmr: any;
  }
}
// var _tmr = window._tmr || (window._tmr = []);
//    _tmr.push({
//    type: "reachGoal",
//    id: PIXEL_ID,
//    value: "VALUE",
//    goal: "purchase",
//    params: {
//        product_id: ['PRODUCT_ID_1','PRODUCT_ID_2','PRODUCT_ID_N']
//    }
// });

let _tmr = window._tmr || (window._tmr = [])
abstract class Metrics {
  static pixelID = 3545385

  static buy(totalPrice: number, IDs: number[]) {
    _tmr.push({ 
      type: 'reachGoal', 
      id: this.pixelID, 
      value: totalPrice, 
      goal: 'order', 
      params: {
        product_id: IDs
      }
    });
  }
  static registration() {
    _tmr.push({ 
      type: 'reachGoal', 
      id: this.pixelID, 
      goal: 'registration'
    });
  }
  static addToCart(product_id: number, price: number) {
    _tmr.push({ 
      type: 'reachGoal', 
      id: this.pixelID, 
      value: price, 
      goal: 'addbasket', 
      params: { product_id }
    });
  }
}

export default Metrics
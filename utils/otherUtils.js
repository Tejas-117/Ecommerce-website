function calculateAmount(items){
   let amount = 0;
   
   items.forEach(item => {
     amount += (item.price * item.quantity);
   })
   if(amount === 0) amount = 1;
 
   const tax = amount * 0.18;
   const total = (amount + tax); // in cents

   return  Math.round(roundToTwo(total) * 100);
}

function roundToTwo(num) {
   return +(Math.round(num + "e+2")  + "e-2");
}

module.exports = {
   calculateAmount
}
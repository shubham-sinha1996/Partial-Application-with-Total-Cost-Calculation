import data from "./data.json";
import Row from "./Row";
const productsDiv = document.querySelector("#products");

const renderRows = function (items) {
  const domNodes = items
    .map(({ product, cost, totalCost = "N/A" }) =>
      Row(product, cost, totalCost)
    )
    .join("");

  productsDiv.innerHTML = domNodes;
};

const totalCost = function (tax, shipping, cost) {
  return (Number(tax) / 100) * Number(cost) + Number(cost) + Number(shipping);
};

// smartphones and catfood are taxed at 12%
// televisions are taxed at 18%
// Default shipping rates (if absent in dataset): Pet food (2.5), Smartphones (5), Televisions (15)

const tax = {
  tax12: totalCost.bind(null, 12),
  tax18: totalCost.bind(null, 18),
};

const shipping = {
  petfood: tax.tax12.bind(null, 2.5),
  smartphones: tax.tax12.bind(null, 5),
  televisions: tax.tax18.bind(null, 15),
};

(function () {
  const revised = data.map((item) => {
    return {
      ...item,
      totalCost: !item.shipping
        ? shipping[item.category](item.cost)
        : ["petfood", "smartphones"].includes(item.category)
        ? tax.tax12(item.shipping, item.cost)
        : tax.tax18(item.shipping, item.cost),
    };
  });

  renderRows(revised);
})();

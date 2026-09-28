const fs = require("fs");
const path = require("path");

const w = {};
new Function("window", fs.readFileSync(path.join(__dirname, "..", "catalog-data.js"), "utf8"))(w);
const cat = w.SHRUHI_CATALOG || [];

const header = "id,title,description,availability,condition,price,link,image_link,brand\n";
const rows = cat.map((item) => {
  const desc = `${item.name} | Verified MRP: ${item.priceFormatted} | Sizes: ${item.sizes.join(", ")} (${item.qtyInfo}) | Fabric: ${item.fabric} | Work: ${item.workType} | WhatsApp AI Order: +91 63552 85433`.replace(/"/g, '""');
  const title = `${item.code} - ${item.name} (${item.qtyInfo})`.replace(/"/g, '""');
  const imgUrl = `https://hardik4love-lang.github.io/shruhi-collections/${item.image}`;
  return `"${item.id}","${title}","${desc}","in stock","new","${item.price} INR","https://www.shruhicollections.in/","${imgUrl}","Shruhi Collections"`;
});

const outPath = path.join(__dirname, "shruhi-whatsapp-catalog-6355285433.csv");
fs.writeFileSync(outPath, header + rows.join("\n"), "utf8");
console.log("Generated CSV with", rows.length, "products at", outPath);

const fs = require("fs");
const path = require("path");

const w = {};
new Function("window", fs.readFileSync(path.join(__dirname, "..", "catalog-data.js"), "utf8"))(w);
const cat = w.SHRUHI_CATALOG || [];

const header = "id,title,description,availability,condition,price,link,image_link,brand\n";

const numbers = [
  { num: "6355285433", display: "+91 63552 85433" },
  { num: "9054241725", display: "+91 90542 41725" },
  { num: "8849601725", display: "+91 88496 01725" }
];

for (const n of numbers) {
  const rows = cat.map((item) => {
    const desc = `${item.name} | Verified MRP: ${item.priceFormatted} | Sizes: ${item.sizes.join(", ")} (${item.qtyInfo}) | Fabric: ${item.fabric} | Work: ${item.workType} | WhatsApp 24/7 AI Order: ${n.display} (+91 63552 85433 / +91 90542 41725)`.replace(/"/g, '""');
    const title = `${item.code} - ${item.name} (${item.qtyInfo})`.replace(/"/g, '""');
    const imgUrl = `https://shruhicollections.in/${item.image}`;
    return `"${item.id}","${title}","${desc}","in stock","new","${item.price} INR","https://www.shruhicollections.in/","${imgUrl}","Shruhi Collections"`;
  });

  const outPath = path.join(__dirname, `shruhi-whatsapp-catalog-${n.num}.csv`);
  fs.writeFileSync(outPath, header + rows.join("\n"), "utf8");
  console.log("Generated WhatsApp Catalog CSV with", rows.length, "products for", n.display, "at", outPath);
}

import { createClient } from "@wix/sdk";
import { products } from "@wix/stores";
import { useState, useEffect } from "react";

const myWixClient = createClient({
  modules: { products },
  auth: {
    siteId: process.env.NEXT_PUBLIC_WIX_SITE_ID,
    apiKey: process.env.NEXT_PUBLIC_WIX_API_KEY
  }
});

export default function Store() {
  const [productList, setProductList] = useState([]);

  async function fetchProducts() {
    try {
      const productList = await myWixClient.products.queryProducts().find();
      setProductList(productList.items);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  async function addProduct(productData) {
    try {
      const newProduct = await myWixClient.products.createProduct({
        product: {
          name: productData.name,
          description: productData.description,
          price: {
            currency: 'MYR',
            price: productData.price
          },
          sku: productData.sku,
          visible: true,
          stock: {
            trackQuantity: true,
            quantity: productData.quantity || 0
          }
        }
      });
      
      // Refresh the product list after adding
      fetchProducts();
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div>
        <h2>Products:</h2>
        {productList.map((product) => {
          return (
            <div key={product._id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price?.formatted}</p>
              <p>SKU: {product.sku}</p>
              <p>Stock: {product.stock?.quantity}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export the client and functions for use in other components
export { myWixClient, Store };

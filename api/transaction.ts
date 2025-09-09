import {
  CurrencyCode,
  Environment,
  ITransactionItemWithNonCatalogPrice,
  Paddle,
  TaxCategory,
} from "@paddle/paddle-node-sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const paddle = new Paddle(process.env.PADDLE_SECRET || "", {
  environment: Environment.sandbox,
});

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail_url: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { products } = req.body as { products: Product[] };

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    const items: ITransactionItemWithNonCatalogPrice[] = products.map(
      (product) => ({
        quantity: 1,
        price: {
          description: `Price for ${product.title}`,
          unitPrice: {
            currencyCode: "USD" as CurrencyCode,
            amount: (product.price * 100).toString(),
            quantity: {
              min: 1,
              max: 1,
            },
          },

          product: {
            name: product.title,
            description: product.description,
            taxCategory: "standard" as TaxCategory,
            imageUrl: product.thumbnail_url,
          },
        },
      })
    );

    const transaction = await paddle.transactions.create({ items });

    return res.status(200).json({ transaction: transaction.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create transaction" });
  }
}

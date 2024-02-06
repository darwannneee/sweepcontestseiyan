import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/sales', async (req, res) => {
    try {
        const response = await fetch('https://api.prod.pallet.exchange/api/v1/marketplace/activities?chain_id=pacific-1&event_type=sale&nft_address=sei1za9z9l8pwueataj5gx7mwt8g5zrndhjls7yr6tnhan0zlgw2r8fszn5089&page=1&page_size=500');
        const result = await response.json();
        const data = result.activities;

        const block = data.filter(seiyans => seiyans.block > 55647474 && seiyans < 59,717,348);
        const sale = block.filter(aa => aa.event_type === "sale");

        const buyerCounts = sale.reduce((acc, item) => {
            const buyer = item.buyer || 'Unknown Buyer';
            acc[buyer] = (acc[buyer] || 0) + 1;
            return acc;
        }, {});

        const sortedBuyerCounts = Object.entries(buyerCounts)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        const responseData = {
            totalSales: sale.length,
            buyerCounts: sortedBuyerCounts
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/address', async (req, res) => {
    try {
        const response = await fetch('https://api.prod.pallet.exchange/api/v1/marketplace/activities?chain_id=pacific-1&event_type=sale&nft_address=sei1za9z9l8pwueataj5gx7mwt8g5zrndhjls7yr6tnhan0zlgw2r8fszn5089&page=1&page_size=500');
        const result = await response.json();
        const data = result.activities;

        // Filter and extract specific fields
        const filteredData = data
            .filter(seiyans => seiyans.block > 55647474 && seiyans < 59,717,348 && seiyans.event_type === "sale")
            .map(({ buyer, price_value, ts, token, block }) => ({
                buyer,
                token_name: token.name,
                price_value,
                ts,
                block
            }));

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

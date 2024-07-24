INSERT INTO
  products (
    id,
    created_at,
    name,
    url,
    website_image_url,
    icon_url,
    meta,
    description,
    category_id,
    subcategory
  )
VALUES
  (
    '07fc51e3-872c-4b8f-9978-dd058071e6b9',
    '2024-04-12T15:25:54.311Z',
    '&facts',
    'https://www.andfacts.com/',
    'images/&facts.webp',
    'images/&facts-icon.webp',
    '{"what":"A market insights platform primarily constructed for consumer brands, providing real-time updates about shifting consumer demands and aiding in identifying product opportunities and optimizing marketing strategies.","who":"This product is designed for consumer brands looking to stay ahead of market trends, identify new product opportunities, optimize marketing strategies, and streamline product launch plans.","best_features":["Real-time updates on shifting consumer demands","Detailed market and product insights for strategic decision-making","AI-driven data processing for quick and efficient actionable insights"],"pricing":[]}',
    'The &facts platform is a market insights tool for consumer brands, offering deep analysis on market and product signals to anticipate trends, identify opportunities, and optimize strategies. It provides real-time updates on consumer demands, aids in new product development, business optimization, competitor analysis, and international expansion. With advanced AI capabilities, the platform deciphers market dynamics and consumer trends to drive growth and success.',
    NULL,
    '["Consumer Brands","Data Analysis","AI Solutions"]'
  );

UPDATE
  products
SET
  category_id = 14393009
WHERE
  id = '07fc51e3-872c-4b8f-9978-dd058071e6b9';
export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
    baidu_aip_easedl_api_key: process.env.BAIDU_AIP_EASEDL_API_KEY,
    baidu_aip_easedl_secret_key: process.env.BAIDU_AIP_EASEDL_SECRET_KEY,
    baidu_aip_app_id: process.env.BAIDU_AIP_APP_ID,
    baidu_aip_api_key: process.env.BAIDU_AIP_API_KEY,
    baidu_aip_secret_key: process.env.BAIDU_AIP_SECRET_KEY,
    cookie: process.env.COOKIE,
    store_api_url: process.env.STORE_API_URL || '',
    mongo: process.env.MONGO || '',
});

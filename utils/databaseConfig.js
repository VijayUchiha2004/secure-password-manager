const parsePort = value => {
    const port = Number.parseInt(value || '3306', 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('DB_PORT must be a valid TCP port.');
    }
    return port;
};

const getDatabaseOptions = () => {
    const options = {
        host: process.env.DB_HOST,
        port: parsePort(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

    if (process.env.DB_SSL === 'true') {
        options.ssl = {
            rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
        };

        if (process.env.DB_SSL_CA) {
            options.ssl.ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
        }
    }

    return options;
};

module.exports = getDatabaseOptions;

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
        const caCertificate = process.env.DB_SSL_CA
            ? process.env.DB_SSL_CA.replace(/\\n/g, '\n')
            : undefined;
        options.ssl = {
            rejectUnauthorized: Boolean(caCertificate)
                && process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
        };

        if (caCertificate) {
            options.ssl.ca = caCertificate;
        }
    }

    return options;
};

module.exports = getDatabaseOptions;

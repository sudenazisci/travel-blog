const noSqlInjectionPrevent = (req, res, next) => {
    const hasNoSql = (obj) => {
        if (!obj || typeof obj !== 'object') return false;
        
        for (let key in obj) {
            if (key.startsWith('$')) return true;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (hasNoSql(obj[key])) return true;
            }
        }
        return false;
    };

    if (hasNoSql(req.body) || hasNoSql(req.query) || hasNoSql(req.params)) {
        return res.status(403).json({ error: 'Forbidden', message: 'NoSQL Injection detected' });
    }
    next();
};

const customHpp = (req, res, next) => {
    if (req.query) {
        for (let key in req.query) {
            if (Array.isArray(req.query[key])) {
                return res.status(400).json({ error: 'Bad Request', message: 'HTTP Parameter Pollution detected' });
            }
        }
    }
    next();
};

module.exports = { noSqlInjectionPrevent, customHpp };

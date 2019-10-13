const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    console.log(req.get('Authorization'))
    const authToken = req.get('Authorization') || ''
    console.log(authToken)
    let basicToken
    if (!authToken.toLowerCase().toString().startsWith('basic ')) {
        return res.status(401).json({ error: 'Missing basic token' })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
    }
    const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(basicToken)
    console.log(tokenUserName)
    if (!tokenUserName || !tokenPassword) {
        return res.status(401).json({ error: 'Unauthorized Request' })
    }
    AuthService.getUserWithUserName(
            req.app.get('db'),
            tokenUserName
        )
        .then(user => {
            if (!user || user.password !== tokenPassword) {
                return res.status(401).json({ error: 'Unauthorized Request' })
            }
            req.user = user
            next()
        })
        .catch(next)
}
module.exports = {
    requireAuth,
}
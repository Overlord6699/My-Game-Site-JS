module.exports.logout = (req, res) => {
    res.clearCookie('token');
}
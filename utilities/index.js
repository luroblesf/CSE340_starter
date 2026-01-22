async function getNav() {
    return `
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/fsws">FSWS</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  `
}

// Middleware para manejar errores en controladores
function handleErrors(controller) {
    return async function (req, res, next) {
        try {
            await controller(req, res)
        } catch (err) {
            next(err)
        }
    }
}

// Export the functions
module.exports = { getNav, handleErrors }

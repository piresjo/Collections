import express from 'express'

import createError from 'http-errors'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import fileUpload from 'express-fileupload'

import { fileURLToPath } from 'url'
import makeApiRouter from './routes/api.js'
import makeSiteRouter from './routes/index.js'

import os from 'os'

export default function makeApp(database) {
    const app = express()

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    // view engine setup
    app.set('views', path.join(__dirname, 'views'))

    app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(fileUpload({ useTempFiles: true, tempFileDir: os.tmpdir() }))

    app.use('/', makeSiteRouter(database))
    app.use('/api', makeApiRouter(database))

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404))
    })

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message
        res.locals.error = req.app.get('env') === 'development' ? err : {}

        // render the error page
        res.status(err.status || 500)
        res.render('error.ejs', { status: 500, error: err })
    })

    return app
}
